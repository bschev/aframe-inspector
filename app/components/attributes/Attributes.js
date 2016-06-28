var React = require('react');
var Component = require('./Component');
var AttributeRow = require('./AttributeRow');
var handleEntityChange = require('../widgets').handleEntityChange;
var InputWidget = require('../widgets').InputWidget;
var Events = require('../../lib/Events.js');

function isSingleProperty (schema) {
  if ('type' in schema) {
    return typeof schema.type === 'string';
  }
  return 'default' in schema;
}

// @todo Take this out and use handleEntityChange ?
function changeId(entity, componentName, propertyName, value) {
  if (entity.id !== value) {
    entity.id = value;
    Events.emit('entityIdChanged', entity);
  }
}

var AddComponent = React.createClass({
  addComponent: function() {
    this.props.entity.setAttribute(this.refs.select.value, '');
  },
  render: function() {
    var entity = this.props.entity;
    if (!entity) {
      return <div></div>;
    }
    var usedComponents = Object.keys(this.props.entity.components);

    return <div className="collapsible">
            <div className="static"><div className="button"></div><span>COMPONENTS</span><div className="menu"></div></div>
            <div className="content">
              <div className="row">
                <span className="text">Add</span>
                <span className="value">
                  <select ref="select">
                  {
                    Object.keys(AFRAME.components)
                        .filter(function(key){return usedComponents.indexOf(key)==-1;})
                        .sort()
                        .map(function(value) {
                      return <option key={value} value={value}>{value}</option>;
                    }.bind(this))
                  }
                  </select>
                  <a href="#" className="button fa fa-plus-circle" onClick={this.addComponent}></a>
                </span>
              </div>
            </div>
          </div>;
  }
});

var CommonComponent = React.createClass({
  render: function() {
    var entity = this.props.entity;
    var components = entity ? this.props.entity.components : {};
    if (!entity) {
      return <div></div>;
    }
    return <div className="collapsible">
            <div className="static"><div className="button"></div><span>COMMON</span><div className="menu"></div></div>
            <div className="content">
              <div className="row">
                <span className="text">Type</span>
                <span className="value">{entity.tagName}</span>
              </div>
              <div className="row">
                <span className="text">ID</span>
                <InputWidget onChange={changeId} entity={entity} name="id" value={entity.id}/>
              </div>
              {
                Object.keys(components).filter(function(key){return ['visible','position','scale','rotation'].indexOf(key)!=-1;}).map(function(key) {
                  var componentData = components[key];
                  var schema = AFRAME.components[key].schema;
                  var data = isSingleProperty(schema) ? componentData.data : componentData.data[key];
                  return <AttributeRow onChange={handleEntityChange} key={key} name={key} schema={schema} data={componentData.data} componentname={key} entity={this.props.entity} />
                }.bind(this))
              }
            </div>
          </div>;
  }
});


var Attributes = React.createClass({
  render: function() {

    var entity = this.props.entity;
    var components = entity ? this.props.entity.components : {};
    return <div className="attributes">
        <CommonComponent entity={entity}/>
        <AddComponent entity={entity}/>
        {
    	     Object.keys(components).filter(function(key){return ['visible','position','scale','rotation'].indexOf(key)==-1;}).sort().map(function(key) {
              return <Component entity={entity} key={key} name={key} component={components[key]}/>
	         })
        }
    </div>;
  }
});

module.exports = Attributes;