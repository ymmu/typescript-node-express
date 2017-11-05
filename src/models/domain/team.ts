import {Column, HasMany, Model, Table,PrimaryKey,AutoIncrement} from 'sequelize-typescript';
import Employee from './employee';

@Table
export default class Team extends Model<Team> {

// @AutoIncrement
// @PrimaryKey
// @Column
// Id: number;

@Column
name: string;

@HasMany(() => Employee)
employees: Employee[];
}