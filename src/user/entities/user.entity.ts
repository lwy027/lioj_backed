import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  comment: '用户表',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    comment: '用户名',
    length: 50,
  })
  userName: string;
  @Column({
    comment: '用户密码',
    length: 50,
  })
  userPassword: string;
  @Column({
    comment: '用户头像',
    length: 1024,
    nullable: true,
  })
  userAvator: string;
  @Column({
    comment: '用户角色 0 user 1 admin -1 ban',
    default: 0,
  })
  userRole: number;
  @CreateDateColumn({
    comment: '创建时间',
  })
  createDate: Date;
  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateDate: Date;
}
