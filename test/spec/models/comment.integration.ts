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

  const cleanUp = (cb) => Comment.destroy({where: {}, truncate: true})
    .then(()=> Post.destroy({where: {}, truncate: true}))
    .then(()=> Employee.destroy({where: {}, truncate: true}))
    .then(()=> Team.destroy({where: {}, truncate: true}))
    .then(() => cb());

  beforeEach((done: Function) => {
    cleanUp(() => done());
  });

  const saveComment = (given,cb) => {
    const team = new Team({name: 'it'});
    const tester = new Employee({name: 'test01', address: 'jeju'});
    const post = new Post({title: '게시글 테스트 01', content: '게시글을 등록합니다.'});
    const givenComment = new Comment(given);

    team.save().then((team: Team) => {
      tester.save().then((tester: Employee) => {
        post.save().then((post: Post) => {
          givenComment.save().then((savedComment: Comment) => {
            team.$add('employee', tester);
            tester.$add('post', post);
            tester.$add('comment', savedComment);
            post.$add('comment', savedComment);
            cb(savedComment);
          });
        });
      });
    });
  };

  it('댓글을 등록할 때 등록한 값이 리턴된다', (done: Function) => {
    // given
    let given = {content: '안녕하세요'};
    // when & then
    saveComment(given, (savedComment:Comment) => {
      Post.findOne<Post>({include:[Comment]})
        .then((checkPost: Post)=>{
          expect(checkPost.comments.length).to.be.eql(1);
          console.log(savedComment.content);
          done();
        });
    });
  });

  it('대댓글을 등록할 때 등록한 값이 리턴된다', (done: Function) => {
    // given
    let given = {content: '안녕하세요'};
    let reComment = new Comment({content: '네 반갑습니다'});

    saveComment(given, (savedComment:Comment) => {
      Employee.findOne<Employee>({include:[Comment]}).then((replyer:Employee)=>{
        Post.findOne<Post>({include:[Comment]}).then((readPost:Post) => {
          // when & then
          reComment.save().then((reComment:Comment) => {
            replyer.$add('comment',reComment);
            readPost.$add('comment', reComment);
            savedComment.$add('comment',reComment);
            Post.findOne<Post>({include:[Comment]})
              .then((checkPost:Post)=>{
                expect(checkPost.comments.length).to.be.eql(2);
                done();
              });
          });
        });
      });
    });
  });

});
