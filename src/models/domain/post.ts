import {Table, Column, Model, CreatedAt, UpdatedAt, ForeignKey, HasMany} from 'sequelize-typescript';
import Employee from './employee';
import Comment from './comment';

@Table
export default class Post extends Model<Post> {

  @Column
  title: string;

  @Column
  content: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @ForeignKey(() => Employee)
  @Column
  userId: number;

  @HasMany(() => Comment)
  comment: Comment[];
}