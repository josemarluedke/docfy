declare module 'to-vfile' {
  import { VFile } from 'vfile'; // eslint-disable-line

  // eslint-disable-next-line
  class ToVFile {
    static readSync(filepath: string): VFile;
  }

  export default ToVFile;
}
