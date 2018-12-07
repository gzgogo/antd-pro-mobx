import React, { Component } from 'react';
import { Form, Input } from 'antd';

const EditableContext = React.createContext();

class EditableCell extends Component {
  render() {
    const {
      form: { getFieldDecorator },
      editing,
      record,
      dataIndex,
      inputType,
      ...restProps
    } = this.props;

    return (
      <EditableContext.Consumer>
        {() =>
          // console.log('check: ', this.state);
          (
            <td {...restProps}>
              {editing ? (
                <Form.Item style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: 'Please Input!'
                      }
                    ],
                    initialValue: record[dataIndex]
                  })(<Input />)}
                </Form.Item>
              ) : (
                restProps.children
              )}
            </td>
          )
        }
      </EditableContext.Consumer>
    );
  }
}

export default Form.create()(EditableCell);
