import {expect} from "chai";
import {sequelize} from "../../../src/models/index";
import Employee from "../../../src/models/domain/employee";
import Team from '../../../src/models/domain/team';
import Post from '../../../src/models/domain/post';
import Comment from '../../../src/models/domain/comment';

describe("[Integration] 댓글 모델을 테스트 한다: ", () => {
  before((done: Function) => {
    sequelize.sync().then(() => {

      done();
    }).catch((error: Error) => {
      done(error);
    });
  });

  beforeEach((done: Function) => {
    Comment.destroy({where: {}, truncate: true})
      .then(() => Post.destroy({where: {}, truncate: true}))
      .then(() => Employee.destroy({where: {}, truncate: true}))
      .then(() => Team.destroy({where: {}, truncate: true}))
      .catch(() =>{ console.log("failed cleanUp"); })

      // 테스트 데이터 생성 [Team, Employee, Post]
      .then(() => Team.create({name: 'it'}))
      .then(async () => {
        Team.findOne<Team>({where: {name: 'it'}})
          .then((it_dept: Team) => {
            Employee.bulkCreate([
              {name: 'test01', address: 'jeju', teamId: it_dept.get('id')},
              {name: 'test02', address: 'jeju', teamId: it_dept.get('id')}
            ]).then(() => {
              Employee.findAll<Employee>()
                .then((employees: Employee[]) => {
                  // it_dept.$set('employee', employees);
                  console.log(employees.length);
                  it_dept.$add('employee', employees[0]);
                  it_dept.$add('employee', employees[1]);

                }).then(() =>{
                  Employee.findOne<Employee>({where:{name:'test01'}})
                    .then((writer:Employee) =>{
                      Post.create({title: '게시글 테스트.', content: '게시글을 등록합니다.', userId: writer.get('id')});
                      Post.findOne<Post>({where:{userId:writer.get('id')}})
                        .then((post:Post) =>{
                          writer.$add('post', post);
                          done();
                        });
                    });
                });
            });
          });
      });
  });

  const saveComment = (given, cb) => {
    const comment = new Comment(given);
    comment.save()
      .then((createComment: Comment) => {
        cb(createComment);
      });
  };

  it('댓글을 등록할 때 등록한 값이 리턴된다', (done: Function) => {
    // given
    Post.findAll<Post>()
      .then((readPost: Post[]) => {
        Employee.findOne<Employee>({where: {name: 'test02'}})
          .then((replyer: Employee) => {
            let givenComment = {content: '안녕하세요', userId: replyer.id, postId: readPost[0].id};

            // when & then
            saveComment(givenComment, (savedCommnet: Comment) => {
              expect(savedCommnet.content).to.be.eql(givenComment.content);
              done();
            });
          });
      });
  });

  // it('대댓글을 등록할 때 등록한 값이 리턴된다', (done: Function) => {
  //   // given
  //   Comment
  //     .findAll<Comment>({where: {parentId: null}})
  //     .then((comments: Comment[]) => {
  //       Employee.findOne<Employee>({where: {name: 'test02'}})
  //         .then((replyer: Employee) => {
  //           let comment = comments[0];
  //           console.log(comment.content);
  //           let givenRecomment = {
  //             content: '네, 반갑습니다',
  //             userId: replyer.id,
  //             postId: comment.postId,
  //             parentId: comment.id
  //           };
  //
  //           // when & then
  //           saveComment(givenRecomment, (savedRecomment: Comment) => {
  //
  //             expect(savedRecomment.content).to.be.eql(givenRecomment.content);
  //             console.log(savedRecomment.content);
  //             comment.$add('reComments', savedRecomment);
  //             done();
  //           });
  //         });
  //     });
  // });


});

