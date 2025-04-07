export class PatientDto {
  constructor({
    name,
    phone,
    chartNumber,
    birthGender,
    address,
    memo,
  }: {
    name: string;
    phone: string;
    chartNumber: string;
    birthGender: string;
    address: string;
    memo?: string;
  }) {
    this.name = name;
    this.phone = phone;
    this.chartNumber = chartNumber;
    this.birthGender = birthGender;
    this.address = address;
    this.memo = memo;
  }
  name: string;
  phone: string;
  chartNumber: string;
  birthGender: string;
  address: string;
  memo?: string;
}
