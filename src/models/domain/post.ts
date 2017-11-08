import {Table, Column, Model, CreatedAt, UpdatedAt, AllowNull, ForeignKey, PrimaryKey, AutoIncrement} from 'sequelize-typescript';
import Employee from './employee';

@Table
export default class Post extends Model<Post> {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

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
}