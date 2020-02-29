import React from 'react';
import {
  Table, Input, Button, Popconfirm, Form, notification, Select,
} from 'antd';
import MainLayout from '../components/MainLayout';
import {
  getUsers, giveMeTickets, editTicket, deleteTicket, getTickets, postTicket, validate, assignTicket,
} from '../services/Api';
import { isAuth } from '../utils';

const { Option } = Select;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
    this.toggleEdit = this.toggleEdit.bind(this);
    this.save = this.save.bind(this);
    this.renderCell = this.renderCell.bind(this);
  }

  toggleEdit() {
    this.setState({ editing: !this.state.editing }, () => {
      if (this.state.editing) {
        this.input.focus();
      }
    });
  }

  save(e) {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  renderCell(form) {
    this.form = form;
    const {
      children, dataIndex, record, title,
    } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={(node) => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  }

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataSource: [],
      isAdding: false,
      inputAdd: '',
      options: [],
    };

    this.userColumns = [
      {
        title: 'Id',
        dataIndex: 'id',
      }, {
        title: 'Ticket',
        dataIndex: 'ticket_pedido',
      },
    ];

    this.adminColumns = [
      {
        title: 'Id',
        dataIndex: 'id',
      },
      {
        title: 'Ticket',
        dataIndex: 'ticket_pedido',
        editable: true,
      },
      {
        title: 'Delete',
        dataIndex: 'delete',
        render: (text, record) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)}>
              <Button icon="delete" />
            </Popconfirm>
          </div>
        ),
      },
      {
        title: 'User',
        dataIndex: 'user',
        render: (id, user) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Select
              defaultValue={user.id_usuario ? `${user.id_usuario},${user.id}` : ''}
              style={{ width: 200 }}
              placeholder="Select a user"
              onChange={this.handleAssign}
            >
              {this.state.options.map((option) => <Option value={`${option.id},${user.id}`} key={option.id}>{option.nombre}</Option>)}
            </Select>
          </div>
        ),
      },
    ];
    this.fetch = this.fetch.bind(this);
    this.toggleAdd = this.toggleAdd.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleMoreTickets = this.handleMoreTickets.bind(this);
    this.handleAssign = this.handleAssign.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

  async handleDelete(id) {
    const dataSource = [...this.state.dataSource];
    await deleteTicket({ id_ticket: id });
    this.setState({ dataSource: dataSource.filter((item) => item.id !== id) });
  }

  toggleAdd() {
    this.setState({ isAdding: true });
  }

  handleInput(e) {
    this.setState({ inputAdd: e.target.value });
  }

  async handleAdd() {
    const { inputAdd, dataSource } = this.state;
    const { data } = await postTicket({ ticket_pedido: inputAdd });
    this.setState({
      dataSource: [data, ...dataSource],
      inputAdd: '',
    });
  }

  async handleSave(row) {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    if (item.ticket_pedido !== row.ticket_pedido) {
      const { data } = await editTicket({ id_ticket: row.id, ticket_pedido: row.ticket_pedido });
      newData.splice(index, 1, {
        ...item,
        ...data,
      });
      this.setState({ dataSource: newData });
    } else {
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      this.setState({ dataSource: newData });
    }
  }

  async handleMoreTickets() {
    const { inputAdd, dataSource } = this.state;
    const { data, errors } = await giveMeTickets({ ticket_pedido: inputAdd });
    if (errors.length > 0) {
      notification.warning({
        message: 'Notification',
        description:
        'There are no tickets to get',
      });
    } else {
      this.setState({
        dataSource: [data, ...dataSource],
      });
    }
  }

  async handleAssign(value) {
    let [id_usuario, id_ticket] = value.split(',');
    id_ticket = Number(id_ticket);
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => id_ticket === item.id);
    const item = newData[index];
    const { data } = await assignTicket({ id_ticket, id_usuario });
    newData.splice(index, 1, {
      ...item,
      ...data,
    });
    this.setState({ dataSource: newData });
  }

  async fetch() {
    this.setState({ loading: true });
    const token = isAuth();
    const { data: { tipo } } = await validate(token);
    const { data: tickets } = await getTickets();
    const { data: users } = tipo.nombre === 'Administrador' ? await getUsers() : [];
    this.setState({
      dataSource: tickets,
      loading: false,
      type: tipo.nombre,
      options: users,
    });

    let columns = [];
    if (tipo.nombre === 'Administrador') {
      columns = this.adminColumns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: this.handleSave,
          }),
        };
      });
    } else {
      columns = this.userColumns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: this.handleSave,
          }),
        };
      });
    }
    this.setState({ columns });
  }

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const {
      isAdding, columns, dataSource, loading, type, inputAdd,
    } = this.state;

    return (
      <MainLayout>
        <div>
          { type === 'Administrador'
            ? (
              <div className="add-ticket">
                <Button type="secondary" onClick={this.toggleAdd} style={{ marginBottom: 16, marginRight: 20 }}>
                  Add a Ticket
                </Button>
                { (isAdding)
                  ? (
                    <div>
                      <Input value={inputAdd} onChange={this.handleInput} onPressEnter={this.handleInput} style={{ width: '50%', marginBottom: 20 }} placeholder="Ticket pedido" />
                      <Button type="primary" onClick={this.handleAdd} style={{ marginLeft: 10, marginBottom: 20 }}>
                        Save
                      </Button>
                    </div>
                  )
                  : ''}
              </div>
            ) : (
              <div className="add-ticket">
                <Button type="secondary" onClick={this.handleMoreTickets} style={{ marginBottom: 16, marginRight: 20 }}>
                  Give Me More Tickets!
                </Button>
              </div>
            )}
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            rowKey="id"
            bordered
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            pagination
          />
        </div>
      </MainLayout>
    );
  }
}

export default Dashboard;
