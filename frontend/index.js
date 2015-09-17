/* globals items */
/* eslint react/no-multi-comp: 0 */

"use strict";

const React = require("react");
const R = require("ramda");

const Version = React.createClass({

  displayName: "Version",

  propTypes: {

    hash: React.PropTypes.string,
    name: React.PropTypes.string,
    version: React.PropTypes.string
  },

  render: function () {

    return (
        <a href={"http://ipfs.io/ipfs/" + this.props.hash}>
        {this.props.name + " - " + this.props.version}
        </a>
      );

  }

});

const versionFactory = R.curry((name, versions, version) => {

  return <Version name={name} version={version} hash={versions[version]}/>;
});

const Item = React.createClass({

  displayName: "Item",

  propTypes: {

    item: React.PropTypes.object
  },

  render: function () {

    return (<div>{Object.keys(this.props.item.versions).map(
        versionFactory(this.props.item.name, this.props.item.versions))}</div>);
  }
});

const itemFactory = (item) => {

  return <Item item={item}/>;
};

const DisplayItems = React.createClass({

  displayName: "DisplayItems",

  propTypes: {

    items: React.PropTypes.array
  },

  render: function () {

    return <div>{this.props.items.map(itemFactory)}</div>;
  }
});

const App = React.createClass({

  displayName: "App",

  render: function () {

    return <DisplayItems items={items} />;
  }
});

React.render(<App />, document.body);
