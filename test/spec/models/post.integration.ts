import {expect} from "chai";
import {sequelize} from "../../../src/models/index";
import Employee from "../../../src/models/domain/employee";
import Post from '../../../src/models/domain/post';
import Comment from '../../../src/models/domain/comment';

describe("[Integration] 게시글 모델을 테스트 한다", () => {
  before((done: Function) => {
    sequelize.sync().then(() => {
      let employee = new Employee({name: 'test', address: 'jeju'});
      employee.save();
      done();
    }).catch((error: Error) => {
      done(error);
    });
  });

  const cleanUpEmployee = (cb) => Employee.destroy({where: {}, truncate: true}).then(() => cb());
  const cleanUpPost = (cb) => Post.destroy({where: {}, truncate: true})
    .then(() => Comment.destroy({where: {}, truncate: true}).then(() => cb()));

  beforeEach((done: Function) => {
    cleanUpPost(() => done());
  });

  after((done:Function)=>{
    cleanUpEmployee(() => done());
  })

  const savePost = (given, cb) => {
    const post = new Post(given);
    post.save()
      .then((createPost: Post) => {
        cb(createPost);
      });
  };


  it('게시글을 등록할 때 등록한 값이 리턴된다', (done: Function) => {
    // given
    Employee.findOne<Employee>({where: {name: 'test'}})
      .then((employee: Employee) => {
        let givenPost= {title: '게시글 테스트.', content: '게시글을 등록합니다.', userId: employee.id};

        // when & then
        savePost(givenPost, (savedPost: Post) => {
         expect(savedPost.title).to.be.eql(givenPost.title);
         expect(savedPost.content).to.be.eql(givenPost.content);
         expect(savedPost.userId).to.be.eql(givenPost.userId);
         done();
        });
      });
  });

  it('등록된 게시글을 조회할 때 조회된다', (done: Function) => {
    // given
    Employee.findOne<Employee>({where: {name: 'test'}})
      .then((employee: Employee) => {
        let givenPost= {title: '게시글 테스트.', content: '게시글을 등록합니다.', userId: employee.id};

        // when & then
        savePost(givenPost, (savedPost: Post) => {
          Post.findAll<Post>().then((posts: Post[])=> {
            expect(posts.length).to.be.eql(1);
            done();
          });
        });
      });
  });

  it('"게시글"이라는 키워드를 조회할 때 키워드를 포함한 게시글이 조회된다', (done: Function) => {
    // given
    Employee.findOne<Employee>({where: {name: 'test'}})
      .then((employee: Employee) => {
        let givenPost= {title: '게시글 테스트.', content: '게시글을 등록합니다.', userId: employee.id};

        // when & then
        savePost(givenPost, (savedPost: Post) => {
          Post.findAll<Post>({
            where: {
              $or: [
                {
                  title: {$like: '%게시글%'}
                },
                {
                  content: {$like: '%게시글%'}
                }
              ]
            }
          }).then((posts: Post[])=> {
            expect(posts.length).to.be.eql(1);
            done();
          });
        });
      });
  });

  it('조회한 게시글을 수정할 때 수정된 값이 리턴된다', (done: Function) => {
    // given
    Employee.findOne<Employee>({where: {name: 'test'}})
      .then((employee: Employee) => {
        let givenPost= {title: '게시글 테스트.', content: '게시글을 등록합니다.', userId: employee.id};

        // when & then
        savePost(givenPost, (savedPost: Post) => {
          savedPost.update({
            title: '게시글 수정 테스트',
            content: '게시글을 수정합니다'
          }).then((updatedPost: Post) => {
            expect(updatedPost.get('title')).to.be.eql(savedPost.title);
            expect(updatedPost.get('content')).to.be.eql(savedPost.content);
            done();
          })
        });
      });
  });

  it('조회한 게시글을 삭제하면 리턴된 값이 없다', (done: Function) => {
    // given
    Employee.findOne<Employee>({where: {name: 'test'}})
      .then((employee: Employee) => {
        let givenPost= {title: '게시글 테스트.', content: '게시글을 등록합니다.', userId: employee.id};

        // when & then
        savePost(givenPost, (savedPost: Post) => {
          savedPost.destroy().then(()=>{
            Post.findAll<Post>().then((posts: Post[])=> {
              expect(posts.length).to.be.eql(0);
              done();
            });
          })
        });
      });
  });

  it('조회한 게시글을 삭제하면 리턴된 값이 없다', (done: Function) => {
    // given
    Employee.findOne<Employee>({where: {name: 'test'}})
      .then((employee: Employee) => {
        let givenPost= {title: '게시글 테스트.', content: '게시글을 등록합니다.', userId: employee.id};

        // when & then
        savePost(givenPost, (savedPost: Post) => {
          savedPost.destroy().then(()=>{
            Post.findAll<Post>().then((posts: Post[])=> {
              expect(posts.length).to.be.eql(0);
              done();
            });
          })
        });
      });
  });
});
