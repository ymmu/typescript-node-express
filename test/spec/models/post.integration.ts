import {expect} from "chai";
import {sequelize} from "../../../src/models/index";
import Employee from "../../../src/models/domain/employee";
import Team from '../../../src/models/domain/team';
import Post from '../../../src/models/domain/post';

describe("[Integration] 게시글 모델을 테스트 한다: ", () => {
  before((done: Function) => {
    sequelize.sync().then(() => {
      done();
    }).catch((error: Error) => {
      done(error);
    });
  });

  const cleanUpPost = () => Post.destroy({where: {}, truncate: true});
  const cleanUpEmployee = () => Employee.destroy({where: {}, truncate: true});
  const cleanUpTeam = () => Team.destroy({where: {}, truncate: true});
  const cleanUp = () => Promise.all([cleanUpPost(),cleanUpEmployee(),cleanUpTeam()]);

  beforeEach((done: Function) => {
    cleanUp().then(() => {
      done();
    });
  });

  const savePost = (given, cb) => {
    const team = new Team({name: 'it'});
    const tester = new Employee({name: 'test01', address: 'jeju'});
    const givenPost = new Post(given);

    team.save().then((team: Team) => {
      tester.save().then((tester: Employee) => {
        givenPost.save().then((savedPost: Post) => {
          team.$add('employee', tester);
          tester.$add('post', savedPost);
          cb(savedPost);
        });
      });
    });
  };

  it('게시글을 등록할 때 등록한 값이 리턴된다', (done: Function) => {
    // given
    let givenPost = {title: '게시글 테스트.', content: '게시글을 등록합니다.'};

    // when & then
    savePost(givenPost, (savedPost: Post) => {
      expect(savedPost.title).to.be.eql(givenPost.title);
      done();
    });
  });

  it('직원"test01"가 작성한 게시글만 조회할 때 해당 직원의 게시글만 조회된다', (done: Function) => {
    // given
    let givenPost= {title: '게시글 테스트.', content: '게시글을 등록합니다.'};

    // when & then
    savePost(givenPost, () => {
      Employee.findOne<Employee>({include:[Post]})
        .then((writer: Employee) => {
          writer.posts.forEach(post => {
            expect(post.userId).to.be.equal(writer.id);
            done();
          });
      });
    });
  });

  it('"게시글"이라는 키워드를 조회할 때 키워드를 포함한 게시글이 조회된다', (done: Function) => {
    // given
    let givenPost= {title: '게시글 테스트.', content: '게시글을 등록합니다.'};

    // when & then
    savePost(givenPost, () => {
      Post.findAll<Post>({
        where: {$or: [
          { title: {$like: '%게시글%'}},
          { content: {$like: '%게시글%'}}
        ]}
      })
      .then((posts: Post[])=> {
        expect(posts.length).to.be.eql(1);
        done();
      });
    });
  });

  it('조회한 게시글을 수정할 때 수정된 값이 리턴된다', (done: Function) => {
    // given
    let givenPost= {title: '게시글 테스트.', content: '게시글을 등록합니다.'};

    // when & then
    savePost(givenPost, (savedPost: Post) => {
      savedPost.update({
        title: '게시글 수정 테스트',
        content: '게시글을 수정합니다'
      })
      .then((updatedPost: Post) => {
        expect(updatedPost.get('title')).to.be.eql(savedPost.title);
        expect(updatedPost.get('content')).to.be.eql(savedPost.content);
        done();
      });
    });
  });

  it('조회한 게시글을 삭제하면 리턴된 값이 없다', (done: Function) => {
    // given
    let givenPost= {title: '게시글 테스트.', content: '게시글을 등록합니다.'};

    // when & then
    savePost(givenPost, (savedPost: Post) => {
      savedPost.destroy()
        .then(()=>{ Post.findAll<Post>()
          .then((posts: Post[])=> {
            expect(posts.length).to.be.eql(0);
            done();
          });
        });
    });
  });

});
