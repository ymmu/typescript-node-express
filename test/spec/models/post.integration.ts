import {expect} from "chai";
import {sequelize} from "../../../src/models/index";
import Employee from "../../../src/models/domain/employee";
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

  it('테스트용 직원을 만든다', (done: Function) => {
    // given
    let employee = new Employee({name: 'test', address: 'jeju'});
    // when & then
    employee.save()
      .then((createEmployee: Employee) => {
        Employee.findOne<Employee>({where: {name: 'test'}})
          .then((employee: Employee) => {
            expect(employee.name).to.be.eql(createEmployee.name);
            done();
          });
      });
  });

  it('게시글을 등록할 때 등록한 값이 리턴된다', (done: Function) => {
    // given
    Employee.findOne<Employee>({where: {name: 'test'}})
      .then((employee: Employee) => {
        let givenPost = {title: '게시글 테스트.', content: '게시글을 등록합니다.', userId:employee.id};

        savePost(givenPost, (savedPost: Post) => {

          done();
        });

        // done();
      });


    // when

  });


});
