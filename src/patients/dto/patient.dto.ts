export class PatientDto {
  constructor({
    id,
    name,
    phone,
    chart,
    rrn,
    address,
    memo,
  }: {
    id: string;
    name: string;
    phone: string;
    chart: string;
    rrn: string;
    address: string;
    memo?: string;
  }) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.chart = chart;
    this.rrn = rrn;
    this.address = address;
    this.memo = memo;
  }
  id: string;
  name: string;
  phone: string;
  chart: string;
  rrn: string;
  address: string;
  memo?: string;
}
