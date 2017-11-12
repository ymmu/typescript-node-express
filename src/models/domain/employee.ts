import { Table, Column, Model, CreatedAt, UpdatedAt, ForeignKey, HasMany} from 'sequelize-typescript';
import Team from './team';
import Post from './post';
import Comment from './comment';

@Table
export default class Employee extends Model<Employee> {

  @Column
  name: string;

  @Column
  address: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @ForeignKey(() => Team)
  @Column
  teamId: number;

  @HasMany(() => Post)
  posts: Post[];

  @HasMany(() => Comment)
  comments: Comment[];
}