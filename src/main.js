import Odometer from "react-odometerjs";
import React from "react";
import emoji from "country-to-emoji-flag";

const Panel = props => (<section className={"panel" + (props.primary ? " primary" : "")}>
  {props.children}
</section>);

const Counter = props => (<div>
  <div className="od"><Odometer value={props.value} format="(,ddd,ddd)" duration={4000} /></div>
  <div>{props.label}</div>
</div>);

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      downloads: 11002330,
      newtabs: 2000000,
      pocket: 22992,
      uniques: 500000,
      countries: [
        {code: "US", name: "US", count: 12319932},
        {code: "DE", name: "Germany", count: 4212932},
        {code: "IN", name: "India", count: 32112312},
        {code: "CA", name: "Canada", count: 3432234},
        {code: "CN", name: "China", count: 3213212},
      ]
    };
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({
        downloads: this.state.downloads + 1312
      });
    }, 4000);
    setInterval(() => {
      this.setState({
        newtabs: this.state.newtabs + 1529
      });
    }, 6000);
    setInterval(() => {
      this.setState({
        pocket: this.state.pocket + 30
      });
    }, 5000);
    setInterval(() => {
      this.setState({
        uniques: this.state.uniques + 300
      });
    }, 3000);
  }
  render() {
    return (<main>
      <Panel primary><Counter value={this.state.downloads} label="Quantum Users" /></Panel>
      <section className="three">
        <Panel><Counter value={this.state.newtabs} label="New Tabs Opened" /></Panel>
        <Panel><Counter  value={this.state.pocket} label="Pocket Stories Read" /></Panel>
        <Panel>
          <div>
            <h3>Most Users</h3>
            <table className="country-table">
              <tbody>
              {this.state.countries.map(country => (
                <tr key={country.code}>
                  <td className="flag">{emoji(country.code)}</td>
                  <td>{country.name}</td>
                  <td>{country.count}</td>
                </tr>
              ))}
              </tbody>
          </table>
          </div>
        </Panel>
      </section>
    </main>);
  }
}

ReactDOM.render(<App />, document.getElementById("root"))
