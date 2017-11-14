import Odometer from "react-odometerjs";
import React from "react";
import emoji from "country-to-emoji-flag";

const DATA_URL = "https://sql.telemetry.mozilla.org/api/queries/49097/results.json?api_key=";

const FIVE_MINUTES = 5 * 60 * 1000;

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
  console.log(resp);
  const data = resp.query_result.data.rows;
  const {total: users, count: newtabs} = data[0];
  const {total: pocket} = data[1];
  const countries = getTopFiveCountries(data.splice(2)
    .map(item => ({code: item["?column?1"], count: item.total})));
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

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      _apiKey: "",
      users: 0,
      newtabs: 0,
      pocket: 0,
      countries: []
    };
    this.updateData = this.updateData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  async updateData() {
    const data = await getData(this.state.apiKey);

    if (data) {
      this.setState(data);
    }
  }
  async onSubmit(e) {
    await this.setState({apiKey: this.state._apiKey});
    this.updateData();
    if (!this.inverval) {
      this.interval = setInterval(this.updateData, FIVE_MINUTES);
    }
  }
  render() {
    if (!this.state.apiKey) {
      return (<form onSubmit={this.onSubmit}>
        <input type="text" value={this.state._apiKey} onChange={e => this.setState({_apiKey: e.target.value})} />
        <button>SUBMIT</button>
      </form>);
    }
    return (<main>
      <section className="title">
        <div id="logo" />
      </section>
      <Panel primary><Counter value={this.state.users} label="New Tab Users" /></Panel>
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

ReactDOM.render(<App />, document.getElementById("root"))
