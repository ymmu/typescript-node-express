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
    const cleanUpComment = (cb) => Comment.destroy({where: {}, truncate: true})
      .then(() => cb());

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
      Post.findOne<Post>({where: {id: 1}})
        .then((readPost: Post) => {
          Comment.findAll<Comment>({where: {postId: readPost.id}})
            .then((readComments: Comment[]) => {
              Employee.findOne<Employee>({where: {name: 'test02'}})
                .then((replyer: Employee) => {
                  let givenRecomment = {
                    content: '네, 반갑습니다',
                    userId: replyer.id,
                    postId: readPost.id,
                    parent: readComments[0].id
                  };

                  // when & then
                  saveComment(givenRecomment, (savedRecomment: Comment) => {
                    expect(savedRecomment.content).to.be.eql(givenRecomment.content);
                    readComments[0].update({
                      childId: [savedRecomment]
                    });
                    done();
                  });
                });
            });
        });
    });

    it('등록된 게시글을 조회할 때 댓글도 함께 조회된다', (done: Function) => {
      // given
      Post.findOne<Post>({where: {id: 1}})

        // when & then
        .then((readPost: Post) => {
          Comment.findAll<Comment>({where: {postId: readPost.id}})
            .then((readComments: Comment[]) => {
              expect(readComments.length).to.be.eql(2);
              done();
            });
        });
    });

  it('댓긆에 달린 대댓글이 조회된다', (done: Function) => {
    // given
    Post.findOne<Post>({where: {id: 1}})

    // when & then
      .then((readPost: Post) => {
        Comment.findAll<Comment>({where: {postId: readPost.id}})
          .then((readComments: Comment[]) => {
            expect(readComments.length).to.be.eql(2);
            done();
          });
      });
  });

  // 대댓글에는 대대댓글을 달수없다
  // 댓글이 삭제되면 '삭제된 댓글입니다'로 바뀌고 대댓글은 삭제되지 않는다
  //
  //
});
