declare function modifyCode(code: string, filePath?: string): ModifyCode;
export default modifyCode;

interface ModifyCode {
  prepend(str: string) : ModifyCode,
  append(str: string) : ModifyCode,
  insert(start: number, str: string) : ModifyCode,
  replace(start: number, end: number, str: string) : ModifyCode,
  delete(start: number, end: number) : ModifyCode,
  transform(): ModifyCodeResult
}

interface ModifyCodeResult {
  code: string,
  map: SourceMap
}

interface SourceMap {
  version: number,
  // file, sources, sourcesContent are optional in spec,
  // but ModifyCodeResult always have them.
  file: string,
  sources: string[],
  sourcesContent: string[],
  sourceRoot?: string,
  names?: string[],
  mappings: string
}
