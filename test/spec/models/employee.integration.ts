import {expect} from "chai";
import {sequelize} from "../../../src/models/index";
import Team from '../../../src/models/domain/team';
import Employee from "../../../src/models/domain/employee";

describe("[Integration] 직원 모델을 테스트 한다", () => {
  before((done: Function) => {
    sequelize.sync({force: true}).then(() => {
      done();
    }).catch((error: Error) => {
      done(error);
    });
  });

  const cleanUpEmployee = () => Employee.destroy({where: {}, truncate: true});
  const cleanUpTeam = () => Team.destroy({where: {}, truncate: true});
  const cleanUp = () => Promise.all([cleanUpEmployee(),cleanUpTeam()]);

  beforeEach((done: Function) => {
    cleanUp().then(() => {
      done();
    });
  });

  const save = (given, cb) => {
    const team = new Team({name: 'it'});
    const givenEmployee = new Employee(given);

    team.save().then((team: Team) => {
      givenEmployee.save().then((saveEmployee: Employee) => {
        team.$add('employee', saveEmployee);
        cb(saveEmployee);
      });
    });
  };

  it('직원을 등록할 때 등록한 값이 리턴된다', (done: Function) => {
    // given
    let givenEmployee = {name: 'test', address: 'jeju'};

    // when
    save(givenEmployee, (saveEmployee: Employee) => {
      // then
      expect(saveEmployee.name).to.be.eql(givenEmployee.name);
      expect(saveEmployee.address).to.be.eql(givenEmployee.address);
      done();
    });
  });

  it('등록한 직원을 조회할 때 조회된다', (done: Function) => {
    // given
    let givenEmployee = {name: 'test', address: 'jeju'};

    // when & then
    save(givenEmployee, () => {
      Employee.findAll<Employee>().then((employees: Employee[]) => {
        expect(employees.length).to.be.eql(1);
        done();
      });
    });
  });

  it('rose 라는 직원을 검색하는 경우 rose 직원의 정보가 리턴된다', (done: Function) => {
    // given
    let givenEmployee = {name: 'rose', address: 'jeju'};

    // when
    save(givenEmployee, () => {
      Employee.findOne<Employee>({where: {name: 'rose'}})
        .then((employee: Employee) => {
          expect(employee.name).to.be.eql(givenEmployee.name);
          done();
        });
    });
  });

  it('apple, go 라는 직원 중에 apple 직원을 검색하는 경우 apple 직원의 정보가 리턴된다', (done: Function) => {
    // given
    const apple = {name: 'apple', address: 'jeju'};
    const go = {name: 'go', address: 'jeju'};

    // when & then
    save(apple, () => {
      save(go, () => {
        Employee.findOne<Employee>({where: {name: 'apple'}})
          .then((employee: Employee) => {
            expect(employee.get('name')).to.be.eql(apple.name);
            done();
          });
      });
    });
  });

  it('it라는 부서에 apple 유저를 등록한다', (done: Function) => {
    // given
    const it_department = new Team({name: 'it'});
    const apple = new Employee({name: 'apple', address: 'jeju'});

    it_department.save().then((savedTeam: Team) => {
        apple.save().then((user: Employee) => {
          savedTeam.$add('employee', user);

          // Eager loading - ({include: [Employee]}) 조인쿼리를 이용해 관계데이터까지 한번에 불러온다
          Team.findAll<Team>({include: [Employee]}).then((teams: Team[]) => {
            const team = teams[0];
            expect(team.employees.length).to.be.eql(1);
            done();
          });
        });
      });
  });
});