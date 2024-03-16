import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from '../../question/entities/question.entity';
import { judgeInfo } from 'src/type';

@Entity({
  comment: '题目提交表',
})
export class QuestionSubmit {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    comment: '编程语言',
    length: 128,
    nullable: false,
  })
  language: string;
  @Column({
    comment: '用户提交代码',
    type: 'text',
    nullable: false,
  })
  code: string;
  @Column({
    comment: '判题信息(json对象)',
    type: 'json',
  })
  judgeInfo: judgeInfo;

  @Column({
    comment: '判题状态 0 待判题 1 判题中 2 成功 3 失败',
    default: 0,
    nullable: false,
  })
  status: number;

  @Column({
    comment: '是否删除',
    type: 'tinyint',
  })
  isDelete: number;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createDate: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateDate: Date;

  //关联创建题目的用户
  @ManyToOne(() => User, {
    nullable: false,
  })
  user: User;

  //关键提交题目id
  @ManyToOne(() => Question, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  question: Question;
}
