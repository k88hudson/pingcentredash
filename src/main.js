import Odometer from "react-odometerjs";
import React from "react";
import emoji from "country-to-emoji-flag";

const DATA_URL = "https://sql.telemetry.mozilla.org/api/queries/49097/results.json?api_key=";
const DEFAULT_DIFF = 50493;
const UPDATE_TIME = 5 * 60 * 1000;

const LOCAL_DATA_URL = "http://localhost:8080/paydirt.json"

function getTopFiveCountries(countries) {
  return countries.sort((a, b) => {
    if (a.count > b.count) {
      return -1;
    } else if (a.count < b.count) {
      return 1;
    } else {
      return 0;
    }
  }).splice(0, 5);
}

async function getData(apiKey) {
  let resp;
  try {
    resp = await (await fetch(DATA_URL + apiKey)).json();
  } catch (e) {
    console.error(e);
    return;
  }
  const data = resp.query_result.data.rows;
  const {total: users, count: newtabs} = data[0];
  const {total: pocket} = data[1];
  const countries = getTopFiveCountries(data.splice(2)
    .map(item => ({code: item["?column?1"], count: item.total})));
  return {users, newtabs, pocket, countries};
}

async function getLocalData() {
  let resp;
  try {
    resp = await (await fetch(LOCAL_DATA_URL)).json();
  } catch (e) {
    console.error(e);
    return;
  }
  const users = resp[0][2];
  const newtabs = resp[0][3];
  const pocket = resp[1][2];
  const countries = getTopFiveCountries(resp.splice(2)
    .map(item => ({code: item[1], count: item[2]})));
    return {users, newtabs, pocket, countries};
}

const Panel = props => (<section className={"panel" + (props.primary ? " primary" : "")}>
  {props.children}
</section>);

const Bubble = props => (<section className="bubble">
{props.children}
</section>);

const Counter = props => (<div>
  <div className="od"><Odometer value={props.value} format="(,ddd,ddd)" duration={4000} /></div>
  {props.label && <div>{props.label}</div>}
</div>);

function increment(currentValue, lastDiff, updateFreq) {
  const amount = lastDiff / (UPDATE_TIME / updateFreq);
  return currentValue + amount;
}

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      _apiKey: "",
      users: 0,
      newtabs: 0,
      pocket: 0,
      countries: [],
      lastUserDiff: 593,
      _lastRealUserCount: null
    };
    this.updateData = this.updateData.bind(this);
    // this.onSubmit = this.onSubmit.bind(this);
  }
  async updateData() {
    // const data = await getData(this.state.apiKey);
    const data = await getLocalData();

    if (data) {
      console.log("Users updated: " + data.users, new Date());
      this.setState(data);
      // let lastUserDiff;
      // const realDiff = this.state._lastRealUserCount && data.users - this.state._lastRealUserCount;
      // if (this.state.users === 0) {
      //   lastUserDiff = this.state.lastUserDiff || DEFAULT_DIFF;
      // } else if (realDiff) {
      //   lastUserDiff = realDiff;
      // } else {
      //   lastUserDiff = this.state.lastUserDiff || DEFAULT_DIFF;
      // }
      // console.log("Last real diff", realDiff);
      // console.log("New user count", data.users);
      // console.log("New diff to use", lastUserDiff);
      // this.setState(Object.assign({}, data, {
      //   _lastRealUserCount: data.users,
      //   lastUserDiff
      // }));
    } else {
      console.log("problem updating");
    }
  }
  setIntervals() {
    if (!this.inverval) {
      this.interval = setInterval(this.updateData, this.props.updateFreq || UPDATE_TIME);
      if (this.props.increment) {
        setInterval(() => {
          this.setState({users: this.state.users + 137});
        }, 7000);
        setInterval(() => {
          this.setState({newtabs: this.state.newtabs + 238});
        }, 2000);
        setInterval(() => {
          this.setState({pocket: this.state.pocket + 13});
        }, 8000);
      }

    }
  }
  // async onSubmit(e) {
  //   await this.setState({apiKey: this.state._apiKey});
  //   this.updateData();
  //   this.setIntervals();
  // }
  async componentDidMount() {
    this.updateData();
    this.setIntervals();
  }
  render() {
    // if (!this.state.apiKey) {
    //   return (<form onSubmit={this.onSubmit}>
    //     <input type="text" value={this.state._apiKey} onChange={e => this.setState({_apiKey: e.target.value})} />
    //     <button>SUBMIT</button>
    //   </form>);
    // }
    return (<main>
      <section className="title">
        <div id="logo" />
      </section>
      <Panel primary><Counter value={this.state.users} label="Users" /></Panel>
      <section className="three">
        <Bubble><Counter value={this.state.newtabs} label="New Tabs Opened" /></Bubble>
        <Bubble><Counter  value={this.state.pocket} label="Pocket Stories Read" /></Bubble>
        <Bubble>
          <div>
            <h3>Most Users</h3>
            <table className="country-table">
              <tbody>
              {this.state.countries.map(country => (
                <tr key={country.code}>
                  <td className="flag">{emoji(country.code)}</td>
                  <td>{country.code}</td>
                  <td><Counter value={country.count} /></td>
                </tr>
              ))}
              </tbody>
          </table>
          </div>
        </Bubble>
      </section>
    </main>);
  }
}

ReactDOM.render(<App increment={window.location.hash === "#increment"} updateFreq={60 * 1000} />, document.getElementById("root"))
