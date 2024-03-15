import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

class JudgeConfig {
  //时间限制
  timeLimit: number;
  //内存限制
  memoryLimit: number;
  //栈限制
  stackLimit: number;
}

interface judgeCase {
  input: string;
  output: string;
}

@Entity({
  comment: '题目表',
})
export class Question {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    comment: '标题',
    length: 512,
  })
  title: string;
  @Column({
    comment: '内容',
    type: 'text',
  })
  content: string;
  @Column({
    comment: '标签列表(json数组)',
    length: 1024,
  })
  tags: string;

  @Column({
    comment: '题目答案',
    type: 'text',
  })
  answer: string;

  @Column({
    comment: '题目提交数',
    default: 0,
    nullable: false,
  })
  submitNum: number;
  @Column({
    comment: '题目通过数',
    default: 0,
    nullable: false,
  })
  acceptNum: number;

  @Column({
    comment: '判题用例(json数组)',
    type: 'text',
  })
  judgeCase: Array<judgeCase>;
  @Column({
    comment: '判题配置(json对象)',
    type: 'text',
  })
  judgeConfig: JudgeConfig;
  @Column({
    comment: '点赞数',
    default: 0,
  })
  thumbNum: number;
  @Column({
    comment: '收藏数',
    default: 0,
  })
  favourNum: number;
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
  @ManyToOne(() => User)
  @JoinTable({
    name: 'question_User',
  })
  user: User;
}
