import {Table, Column, Model, CreatedAt, UpdatedAt, AllowNull, ForeignKey} from 'sequelize-typescript';
import Employee from './employee';
import Post from './post';

@Table
export default class Comment extends Model<Comment> {

  @Column
  content: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @ForeignKey(() => Employee)
  @Column
  userId: number;

  @ForeignKey(() => Post)
  @Column
  postId: number;

  @ForeignKey(() => Comment)
  @AllowNull
  @Column
  commentId: number;
}
