import {expect} from "chai";
import {sequelize} from "../../../src/models/index";
import Employee from "../../../src/models/domain/employee";
import Post from '../../../src/models/domain/post';
import Comment from '../../../src/models/domain/comment';

describe("[Integration] 댓글 모델을 테스트 한다", () => {
  before((done: Function) => {
    sequelize.sync().then(() => {
      Employee.bulkCreate([
        {name: 'test01', address: 'jeju'},
        {name: 'test02', address: 'jeju'}
      ]).then(() => {
        Employee.findOne<Employee>({where: {name: 'test01'}})
          .then((employee: Employee) => {
            Post.create({title: '게시글 테스트', content: '게시글을 등록합니다.', userId: employee.id});
            done();
          });
      }).catch((error: Error) => {
        done(error);
      });
    });
  });

  const cleanUp = (cb) => Employee.destroy({where: {}, truncate: true})
    .then(() => Post.destroy({where: {}, truncate: true})
      .then(() => Comment.destroy({where: {}, truncate: true})
        .then(() => cb())));

  // const cleanUpComment = (cb) => Comment.destroy({where: {}, truncate: true})
  //   .then(() => cb());

  // beforeEach((done: Function) => {
  //   cleanUpComment(() => done());
  // });

  after((done: Function) => {
    cleanUp(() => done());
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
    Post.findOne<Post>({where: {id: 1}})
      .then((readPost: Post) => {
        Employee.findOne<Employee>({where: {name: 'test01'}})
          .then((replyer: Employee) => {
            let givenComment = {content: '안녕하세요', userId: replyer.id, postId: readPost.id};

            // when & then
            saveComment(givenComment, (savedCommnet: Comment) => {
              expect(savedCommnet.content).to.be.eql(givenComment.content);
              done();
            });
          });
      });
  });

  it('대댓글을 등록할 때 등록한 값이 리턴된다', (done: Function) => {
    // given
    Comment
      .findAll<Comment>({where: {parentId: null}})
      .then((comments: Comment[]) => {
        Employee.findOne<Employee>({where: {name: 'test02'}})
          .then((replyer: Employee) => {
            let comment = comments[0];
            console.log(comment.content);
            let givenRecomment = {
              content: '네, 반갑습니다',
              userId: replyer.id,
              postId: comment.postId,
              parentId: comment.id
            };

            // when & then
            saveComment(givenRecomment, (savedRecomment: Comment) => {

              expect(savedRecomment.content).to.be.eql(givenRecomment.content);
              console.log(savedRecomment.content);
              comment.$add('reComments', savedRecomment);
              done();
            });
          });
      });
  });


});

