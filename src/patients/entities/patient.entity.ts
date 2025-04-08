import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('patients')
export class Patients {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: '하이픈 제거된 11자리 숫자',
    nullable: false,
  })
  phone: string; // 하이픈 제거된 11자리 숫자

  @Column({ type: 'varchar', length: 50, nullable: true })
  chart?: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: '생년월일-1 ~ 4',
    nullable: true,
  })
  rrn: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  memo?: string;
}
