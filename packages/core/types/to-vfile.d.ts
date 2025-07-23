declare module 'to-vfile' {
  import { VFile } from 'vfile';

  class ToVFile {
    static readSync(filepath: string): VFile;
  }

  export default ToVFile;
}
