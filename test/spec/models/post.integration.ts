import {expect} from "chai";
import {sequelize} from "../../../src/models/index";
import Employee from "../../../src/models/domain/employee";
// import Team from '../../../src/models/domain/team';
import Post from '../../../src/models/domain/post';
import Comment from '../../../src/models/domain/comment';

describe("[Integration] 게시글 모델을 테스트 한다", () => {
  before((done: Function) => {
    sequelize.sync().then(() => {
      done();
    }).catch((error: Error) => {
      done(error);
    });
  });

  const cleanUp = (cb) => Post.destroy({where: {}, truncate: true}).then(() => cb());

  beforeEach((done: Function) => {
    cleanUp(() => done());
  });


  const save = (given, cb) => {
    const post = new Post(given);
    post.save()
      .then((createPost: Post) => {
        cb(createPost);
      });
  };

  Employee.create({name: 'test', address: 'JeJu'}).then(function(user) {
    console.log(user) // user object with username as Boss and accessLevel of 20
  })


  it('게시글을 등록할 때 등록한 값이 리턴된다', (done: Function) => {

    // given
    let givenPost = {title: '게시글 테스트.', content: '게시글을 등록합니다.',};

    // when
    save(givenPost, (savePost: Post) => {
      // then
      expect(savePost.title).to.be.eql(givenPost.title);
      expect(savePost.content).to.be.eql(givenPost.content);
      done();
    });
  });


});
