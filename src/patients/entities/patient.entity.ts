import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('patients')
export class Patients {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: '하이픈 제거된 11자리 숫자',
    nullable: true,
  })
  phone: string; // 하이픈 제거된 11자리 숫자

  @Column({ type: 'varchar', length: 50, nullable: true })
  chartNumber?: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: '생년월일-1 ~ 4',
    nullable: true,
  })
  birthGender: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  memo?: string;
}
