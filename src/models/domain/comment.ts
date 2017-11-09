///<reference path="../../../node_modules/sequelize-typescript/lib/services/association.d.ts"/>
import {Table, Column, Model, CreatedAt, UpdatedAt, AllowNull, ForeignKey,HasMany,BelongsTo} from 'sequelize-typescript';
import Employee from './employee';
import Post from './post';
import {BELONGS_TO} from "sequelize-typescript/lib/services/association";

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
  @Column
  parentId: number;

  @BelongsTo(() => Comment)
  comment: Comment;

  @HasMany(() => Comment)
  reComments: Comment[];
}
