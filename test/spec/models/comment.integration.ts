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


  it('댓글을 등록할 때 등록한 값이 리턴된다', (done: Function) => {
    // given
    let team = new Team({name: 'it'});
    let tester = new Employee({name: 'test01', address: 'jeju'});
    let post = new Post({ title: '게시글 테스트 01', content: '게시글을 등록합니다.'});
    let comment = new Comment({content: '안녕하세요'});

    team.save().then((team:Team)=>{
      tester.save().then((tester:Employee)=>{
        post.save().then((post:Post) => {
          // when & then
          comment.save().then((comment:Comment)=>{
            team.$add('employee', tester);
            tester.$add('post', post);
            tester.$add('comment',comment);
            post.$add('comment', comment);
          }).then(()=>{
            Post.findOne<Post>({include:[Comment]})
              .then((checkPost: Post)=>{
                expect(checkPost.comments.length).to.be.eql(1);
                done();
              });
          });
        });
      });
    });
  });

  // it('대댓글을 등록할 때 등록한 값이 리턴된다', (done: Function) => {
  //   // given
  //   let team = new Team({name: 'it'});
  //   let tester = new Employee({name: 'test01', address: 'jeju'});
  //   let post = new Post({ title: '게시글 테스트 01', content: '게시글을 등록합니다.'});
  //   let comment = new Comment({content: '안녕하세요'});
  //   let reComment = new Comment({content: '네 반갑습니다'});



    // Comment.findAll<Comment>({where: {commentId: null}})
    //   .then((comments: Comment[]) => {
    //     console.log(comments.length);
    //     Employee.findOne<Employee>({where: {name: 'test02'}})
    //       .then((replyer: Employee) => {
    //         let givenRecomment = {
    //           content: '네, 반갑습니다',
    //           userId: replyer.id,
    //           postId: comments[0].postId,
    //           commentId: comments[0].id
    //         };
    //         // when & then
    //         saveComment(givenRecomment, (savedRecomment: Comment) => {
    //
    //           Post.findOne<Post>({where:{id:comments[0].postId,}})
    //             .then((readPost:Post) => {
    //               replyer.$add('comment',savedRecomment);
    //
    //               readPost.$add('comment',savedRecomment);
    //               comments[0].$add('comment',savedRecomment);
    //               console.log(readPost.comments.length);
    //
    //               done();
    //             });
    //         });
    //       });
    //   });
  // });

  // it('게시글 전체조회시 게시글에 달린 댓글수도 함께 조회된다', (done: Function) => {
  //   // given
  //   Post.findAll<Post>()
  //     .then((posts: Post[]) => {
  //       console.log(posts.length);
  //       // console.log(posts[0].$count('Comment'));
  //       posts.forEach(function(c) {
  //
  //         console.log(c.comments);
  //         done();
  //       });
  //     });
  // });

  // it('게시글을 조회할때 게시글에 달린 댓글도 같이 조회된다', (done: Function) => {
  //   // given
  //
  // });
});
