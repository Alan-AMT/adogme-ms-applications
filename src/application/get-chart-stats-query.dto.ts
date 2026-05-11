import { IsEnum, IsNotEmpty } from 'class-validator';

export enum ChartPeriod {
  SEMANA = 'semana',
  MES = 'mes',
  ANO = 'año'
}

export class GetChartStatsQueryDto {
  @IsNotEmpty()
  @IsEnum(ChartPeriod, { message: 'period must be one of: semana, mes, año' })
  period: ChartPeriod;
}
