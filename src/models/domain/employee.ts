import { Table, Column, Model, CreatedAt, UpdatedAt} from 'sequelize-typescript';
// import Team from './team';

@Table
export default class Employee extends Model<Employee> {

  // @AutoIncrement
  // @PrimaryKey
  // @Column
  // Id: number;

  @Column
  name: string;

  @Column
  address: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  // @ForeignKey(() => Team)
  // @Column
  // teamId: number;
}