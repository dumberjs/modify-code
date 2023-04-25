import {tokenize, type Token} from './tokenize.js';
import {SourceNode, type RawSourceMap} from 'source-map';

interface ModifyCode {
  prepend(str: string): ModifyCode;
  append(str: string): ModifyCode;
  insert(start: number, str: string): ModifyCode;
  replace(start: number, end: number, str: string): ModifyCode;
  delete(start: number, end: number): ModifyCode;
  transform(): ModifyCodeResult;
  transformCodeOnly(): string;
}

interface Mutation {
  start: number;
  end: number;
  value: string;
}

export interface ModifyCodeResult {
  code: string;
  map: RawSourceMap;
}

function panic(mutation: Mutation) {
  throw new Error('Panic! mutation: start=' + mutation.start +
    ' end=' + mutation.end + ' str=' + mutation.value);
}

function compactMutations(mutations: Mutation[]): Mutation[] {
  const _ms = Array.from(mutations);

  _ms.sort(function(a, b) {
    const sdiff = a.start - b.start;
    if (sdiff === 0) {
      return a.end - b.end;
    }
    return sdiff;
  });

  const compact: Mutation[] = [];
  const ii = _ms.length;
  let i = 0, lastOne: Mutation | undefined, m: Mutation;
  for (; i < ii; i++) {
    m = {
      start: _ms[i].start,
      end: _ms[i].end,
      value: _ms[i].value
    };

    if (lastOne && lastOne.end === m.start) {
      // merge to last one
      lastOne.end = m.end;
      lastOne.value += m.value;
    } else {
      compact.push(m);
      lastOne = m;
    }
  }
  return compact;
}

export default function(code: string, filePath?: string): ModifyCode {
  // the file name to be used in sourcemap sources and file fields
  const fp = (filePath || 'file.js').replace(/\\/g, '/');
  const mutations: Mutation[] = [];

  function checkIndex(idx: number): void {
    if (typeof idx !== 'number' || idx < 0) {
      throw new Error('index: ' + JSON.stringify(idx) + ' is not a valid index');
    }
    if (idx > code.length) {
      throw new Error('index: ' + idx + ' is out of range of code length: ' + code.length);
    }
  }

  function checkOverlap(start: number, end: number, str: string): void {
    const ii = mutations.length;
    let i, mutation;
    for (i = 0; i < ii; i++) {
      mutation = mutations[i];
      // don't check insertion against insertion
      if (mutation.start === mutation.end && start === end) continue;
      if (mutation.start < end && mutation.end > start) {
        throw new Error('Conflict! new mutation: start=' + mutation.start +
          ' end=' + mutation.end + ' str=' + mutation.value + ' ' +
          'with existing mutation: start=' + start +
          ' end=' + end + ' str=' + str);

      }
    }
  }

  function replace(start: number, end: number, str: string): ModifyCode {
    let existing;
    checkIndex(start);
    checkIndex(end);
    checkOverlap(start, end, str);

    if (end < start) {
      throw new Error('end-index: ' + end + ' cannot be smaller than start-index: ' + start);
    }

    if (start === end) {
      // allow multiple insertion to same location
      existing = mutations.find(function(m) {
        return m.start === start && m.end === start;
      });
    }

    if (existing) {
      existing.value += str;
    } else {
      mutations.push({start: start, end: end, value: str});
    }
    return modifyCode;
  }

  function sourceNode() {
    const ms = compactMutations(mutations);
    const ii = ms.length;
    const newTokens: Token[] = [];
    const tokens = tokenize(code);
    let i, ti = 0, m, offset, offset2, merged, isInsertion;

    for (i = 0; i < ii; i++) {
      m = ms[i];
      isInsertion = m.start === m.end;

      if (tokens[ti] && tokens[ti].start > m.start) {
        if (newTokens.length && newTokens[newTokens.length - 1].start <= m.start) {
          throw new Error('does not allow mutating same token again. Token affected: ' +
            JSON.stringify(newTokens[newTokens.length - 1].value));
        } else {
          panic(m);
        }
      } else {
        // move to current affected token
        while (tokens[ti] && (isInsertion ?
          tokens[ti].end < m.start :
          tokens[ti].end <= m.start // push replacement to next token
        )) {
          newTokens.push(tokens[ti]);
          ti++;
        }
      }

      if (isInsertion) {
        // an insertion
        if (!tokens[ti]) {
          // this can only happen when
          // 1. empty code where tokens size is zero.
          // 2. append in the end
          if (m.start === 0) {
            newTokens.push({
              value: m.value,
              start: 0,
              end: 0,
              line: 1,
              column: 0
            });
          } else if (newTokens.length && newTokens[newTokens.length - 1].end === m.start) {
            newTokens[newTokens.length - 1].value += m.value;
          } else {
            panic(m);
          }
        } else {
          // insertion in this token
          offset = m.start - tokens[ti].start;
          tokens[ti].value = tokens[ti].value.slice(0, offset) + m.value + tokens[ti].value.slice(offset);
          newTokens.push(tokens[ti]);
          ti++;
        }
      } else {
        // a replacement
        if (!tokens[ti]) panic(m);

        // merge tokens if replacement affects multiple tokens
        merged = tokens[ti];
        while (merged.end < m.end) {
          ti++;
          if (!tokens[ti]) panic(m);
          merged.value = merged.value + tokens[ti].value;
          merged.end = tokens[ti].end;
        }

        offset = m.start - merged.start;
        offset2 = m.end - merged.start;
        merged.value = merged.value.slice(0, offset) + m.value + merged.value.slice(offset2);
        newTokens.push(merged);
        ti++;
      }
    }

    // the rest unaffected tokens
    while (tokens[ti]) {
      newTokens.push(tokens[ti]);
      ti++;
    }

    const node = new SourceNode(null, null, null, newTokens.map(function(t) {
      return new SourceNode(t.line, t.column, fp, t.value);
    }));

    return node;
  }

  const modifyCode: ModifyCode = {
    prepend: function(str: string): ModifyCode {
      return replace(0, 0, str);
    },
    append: function(str: string): ModifyCode {
      return replace(code.length, code.length, str);
    },
    insert: function(start: number, str: string): ModifyCode {
      return replace(start, start, str);
    },
    replace: function(start: number, end: number, str: string): ModifyCode {
      return replace(start, end, str);
    },
    delete: function(start: number, end: number): ModifyCode {
      return replace(start, end, '');
    },
    transform: function () {
      const node = sourceNode();
      const result = node.toStringWithSourceMap({file: filePath});
      result.map.setSourceContent(fp, code);

      return {
        code: result.code,
        map: JSON.parse(result.map.toString())
      };
    },
    transformCodeOnly: function () {
      const node = sourceNode();
      return node.toString();
    }
  };

  return modifyCode;
}
