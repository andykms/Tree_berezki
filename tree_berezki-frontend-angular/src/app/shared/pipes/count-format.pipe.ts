import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'countFormat',
  standalone: true
})
export class CountFormatPipe implements PipeTransform {
  transform(value: string, ...args: any[]) {

    const num = this.toNumber(value);


    if (num >= 1000) {
      return this.toThousands(num);
    } else if(num >= 1000000){
      return this.toMillion(num);
    }
    return value;
  }

  private toNumber(numString: String) {
    const num = Number(numString);
    if(isNaN(num)) {
      return 0;
    }
    return num;
  }

  private toThousands(num: number) {
    return (num / 1000).toFixed(1) + 'K';
  }

  private toMillion(num: number) {
    return (num / 1000000).toFixed(1) + 'M';
  }
}