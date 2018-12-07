import React, { Component } from 'react';
import { Form, Input, Card, Button, Select, Radio, message, Col } from 'antd';
import ajax from 'util/api/ajax';

const serverCategoryData = [
  '医疗',
  '政务民生',
  '电商平台',
  '文娱',
  '工具',
  '出行与交通',
  '房地产',
  '生活服务',
  'IT科技',
  '餐饮',
  '旅游',
  '商家自营',
  '体育',
  '金融业',
  '社交',
  '时政信息',
  '汽车',
  '快递业与邮政',
  '教育',
  '社交红包',
  '商业服务',
  '公益',
  '游戏'
];

const categoryData = {
  医疗: [
    '就医服务',
    '私立医疗机构',
    '药品信息展示',
    '药品（非处方）销售',
    '医疗-血液、干细胞服务',
    '健康咨询、问诊',
    '公立医疗机构',
    '互联网医院',
    '医疗保健信息服务',
    '医疗器械信息展示',
    '医疗器械生产企业',
    '医疗器械经营、销售'
  ],
  政务民生: [
    '交通违法',
    '博物馆',
    '出入境',
    '邮政',
    '车管所服务',
    '城市道路',
    '高速服务',
    '税务',
    '司法',
    '消防',
    '气象',
    '户政',
    '治安',
    '环保',
    '民政',
    '教育',
    '水电局',
    '工商',
    '烟草管理单位',
    '住建',
    '人力资源',
    '文化',
    '社会保障',
    '交警',
    '边防',
    '国安',
    '公证',
    '检察院',
    '法院',
    '纪检审计',
    '财政',
    '公积金',
    '党团组织',
    '食药监',
    '质监',
    '新闻出版及广电',
    '知识产权',
    '旅游局',
    '图书馆',
    '检验检疫',
    '交通',
    '商务',
    '航空',
    '街道居委',
    '农林畜牧海洋',
    '社科档案',
    '政府应急办',
    '科学技术与地质',
    '统计',
    '经济发展与改革',
    '政务服务大厅',
    '安监',
    '医疗',
    '计划生育',
    '体育',
    '水利',
    '信访',
    '物价粮食',
    '城管',
    '监狱戒毒',
    '海关'
  ],
  电商平台: ['电商平台'],
  文娱: ['FM/电台', '有声读物', '动漫', '小说', '资讯', '视频', '音乐', '宗教信息服务'],
  工具: [
    '计算类',
    '报价/比价',
    '信息查询',
    '网络代理',
    '效率',
    '健康管理',
    '企业管理',
    '记账',
    '投票',
    '日历',
    '天气',
    '备忘录',
    '办公',
    '发票查询',
    '字典',
    '图片',
    '预约/报名'
  ],
  出行与交通: [
    '公交',
    '长途客运',
    '停车',
    '代驾',
    '租车',
    '打车（网约车）',
    '航空',
    '火车',
    '路况',
    '水运',
    '地铁',
    '路桥收费',
    '加油/充电柱',
    '城市交通卡',
    '城市共享交通',
    '高速服务',
    '顺丰车（拼车）'
  ],
  房地产: ['物业管理', '房地产开发经营', '房地产', '装修/建材'],
  生活服务: [
    '票务',
    '生活缴费',
    '家政',
    '丽人',
    '摄影/扩印',
    '婚庆服务',
    '宠物（非医院类）',
    '环保回收/废品回收',
    '休闲娱乐',
    '搬家公司',
    '线下超市/便利店',
    '洗浴保健',
    '宠物医院/兽医',
    '开锁服务'
  ],
  IT科技: ['硬件与设备', '电信运营商', '软件服务提供商'],
  餐饮: ['点餐平台', '外卖平台', '点评与推荐', '菜谱', '餐饮服务场所', '餐厅排队'],
  旅游: ['旅游线路', '酒店服务', '公寓/民宿', '门票', '出境WIFI', '旅游攻略', '签证', '景区服务'],
  商家自营: [
    '海淘',
    '美妆/洗护',
    '机械、电子器件',
    '纪念币发售',
    '图书报刊/音像/影视/游戏/动漫等出版物',
    '汽车内饰/外饰',
    '服装/鞋/箱包',
    '玩具/母婴用品(不包含食品)',
    '加点/数码/手机',
    '保健品',
    '珠宝/饰品/眼镜/钟表',
    '运动/户外/乐器',
    '图书报刊/音像/影视/游戏/动漫',
    '食品',
    '鲜花/园艺/工艺品',
    '家居/家饰/家纺',
    '汽车/其他交通工具的配件',
    '办公/文具',
    '五金/建材/化工/矿产品',
    '电话卡销售',
    '成人用品',
    '酒/盐',
    '初级食用农产品',
    '百货',
    '宠物/农资',
    '成品油'
  ],
  体育: ['体育场馆服务', '体育赛事', '体育培训', '在线健身'],
  金融业: [
    '基金',
    '信托',
    '网络借贷信息中介（P2P）',
    '保险',
    '银行',
    '征信业务',
    '股票信息服务平台（港股/美股票)',
    '外币兑换',
    '消费金融',
    '新三板信息服务平台',
    '证券/期货',
    '证券/期货投资咨询',
    '实物黄金买卖',
    '股票信息服务平台',
    '非金融机构自营小额贷款'
  ],
  社交: ['陌生人交友', '熟人交友', '社区/论坛', '婚恋', '直播答题', '问答', '直播', '笔记'],
  时政信息: ['时政信息'],
  汽车: ['养车/修成', '汽车资讯', '汽车报价/比价', '车展服务', '汽车经销商/4S店', '汽车厂商'],
  快递业与邮政: ['寄件/收件', '快递、物流', '仓储', '邮政', '装卸搬运'],
  教育: [
    '婴幼儿教育',
    '在线教育',
    '培训机构',
    '出国移民',
    '驾校培训',
    '特殊人群教育',
    '出国留学',
    '教育装备',
    '学历教育',
    '教育信息服务'
  ],
  社交红包: ['社交红包'],
  商业服务: [
    '会展服务',
    '专利代理',
    '亲子鉴定',
    '拍卖公司（非文物）',
    '文物拍卖公司',
    '一般财务服务',
    '公共印章刻制',
    '第三方人力资源服务',
    '法律服务',
    '律所',
    '招聘/求职（中介类）',
    '农林牧渔',
    '广告/设计',
    '公关/推广/市场调查',
    '公证',
    '典当',
    '会计师事务所',
    '税务师事务所'
  ],
  公益: ['基金会', '公益慈善'],
  游戏: ['竞技游戏', '其他游戏', '休闲游戏', '动作游戏']
};

const { TextArea } = Input;

class CreateMiniProgram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // mpList: [],
      subCategory: categoryData[serverCategoryData[0]]
    };
    this.initial();
  }

  initial = () => {
    console.log('initial');
    // axios({
    //  url: '/v1/mp',
    //  method: 'GET'
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     if (res.code === 0) {
    //       let arr = this.state.mpList;
    //       arr = [];
    //       for (let i = 0; res.data.list.lenght < res.totalCount; i++) {
    //         axios
    //           .get('/v1/mp', {
    //           })
    //           .then((pushRes) => {
    //             for (let j = 0; j < pushRes.data.list.length; j++) {
    //               arr.push(pushRes.data.list[j]);
    //             }
    //             this.setState({
    //               mpList: arr
    //             });
    //           })
    //           .catch((error) => {
    //             console.log(error);
    //           });
    //       }
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    // console.log('this.mpList: ', this.state.mpList);
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if (values.serverCategory === '请选择类目' || values.subCategory === '请选择') {
          message.error('请选择类目! ');
          return;
        }
        console.log('mpList', this.state.mpList);
        // 此处需要检查appid是重复；
        // let appkeyValue;
        let type;
        if (values.mpType === 'miniProgram') {
          type = 0;
        } else {
          type = 1;
        }
        ajax({
          method: 'POST',
          url: '/api/v1/mp',
          data: {
            appId: values.appId,
            appName: values.appName,
            category: values.serverCategory,
            subCategory: values.subCategory,
            description: values.description,
            type
          }
        })
          .then((res) => {
            console.log('log res ', res, res.code);
            if (res.code === 0) {
              message.success('广告位创建成功！');
              this.props.history.push({ pathname: '/project/mediamgr/medialist' });
            }
            if (res.code === 1031020) {
              message.info('请您先完善企业信息！');
              this.props.history.push({ pathname: '/project/usercenter/corporateInformation' });
            }
            if (res.code === 10602002) {
              message.info('创建失败，该小程序已存在！');
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  handleCategoryChange = (value) => {
    console.log('now value values', value);
    const { resetFields } = this.props.form;
    if (value !== '游戏') {
      resetFields('mpType');
    }
    this.setState({
      subCategory: categoryData[value]
    });
    this.props.form.resetFields('subCategory');
  };

  onRadioChange = (e) => {
    console.log('onRadioChange: ', e);
    const { resetFields } = this.props.form;
    if (e.target.value === 'miniGame') {
      this.setState({
        subCategory: categoryData['游戏']
      });
    } else {
      this.setState({
        subCategory: categoryData[serverCategoryData[0]]
      });
    }
    resetFields(['serverCategory', 'subCategory']);
  };

  onRadioChange = (e) => {
    console.log('onRadioChange: ', e);
    const { resetFields } = this.props.form;
    if (e.target.value === 'miniGame') {
      this.setState({
        subCategory: categoryData['游戏']
      });
    } else {
      this.setState({
        subCategory: categoryData[serverCategoryData[0]]
      });
    }
    resetFields(['serverCategory', 'category']);
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { subCategory } = this.state;
    const mpType = getFieldValue('mpType');

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };

    return (
      <div>
        <Card bordered={false}>
          <Form onSubmit={this.onSubmit} style={{ maxWidth: 'initial' }}>
            <Form.Item {...formItemLayout} label="小程序名称">
              {getFieldDecorator('appName', {
                rules: [
                  {
                    required: true,
                    min: 4,
                    max: 30,
                    message: '请输入包含4-30个字符的小程序名称！'
                  }
                ]
              })(<Input placeholder="请输入小程序名称" />)}
            </Form.Item>
            <Form.Item label="小程序类型" {...formItemLayout}>
              {getFieldDecorator('mpType', {
                rules: [
                  {
                    required: true,
                    message: '请选择小程序类型'
                  }
                ],
                initialValue: 'miniProgram'
              })(
                <Radio.Group onChange={this.onRadioChange}>
                  <Radio value="miniProgram">小程序</Radio>
                  <Radio value="miniGame">小游戏</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="APPID" {...formItemLayout}>
              {getFieldDecorator('appId', {
                rules: [
                  {
                    required: true,
                    message: '请输入appId'
                  },
                  {
                    pattern: 'wx[A-Fa-z0-9]',
                    min: 16,
                    max: 20,
                    message: '请核对您的appId ！'
                  }
                ]
              })(<Input placeholder="请输入APPID" />)}
            </Form.Item>
            <Form.Item label="类目" tyle={{ marginTop: 30 }} {...formItemLayout}>
              <Col span={11}>
                <Form.Item>
                  {getFieldDecorator('serverCategory', {
                    rules: [
                      {
                        required: true,
                        message: '请选择类目'
                      }
                    ],
                    initialValue: mpType === 'miniGame' ? serverCategoryData[serverCategoryData.length - 1] : '请选择类目'
                  })(
                    <Select
                      style={{ width: 'auto' }}
                      dropdownMatchSelectWidth={false}
                      onChange={this.handleCategoryChange}
                    >
                      {serverCategoryData.map(theCategory => (
                        <Select.Option key={theCategory}>{theCategory}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item>
                  {getFieldDecorator('subCategory', {
                    rules: [
                      {
                        required: true,
                        message: '请选择子类目!'
                      }
                    ],
                    initialValue: '请选择'
                  })(
                    <Select
                      style={{ width: 'auto', marginLeft: 20 }}
                      dropdownMatchSelectWidth={false}
                    >
                      {subCategory.map(theCategory => (
                        <Select.Option key={theCategory}>{theCategory}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Form.Item>
            <Form.Item label="小程序描述" style={{ marginTop: 30 }} {...formItemLayout}>
              {getFieldDecorator('description')(
                <TextArea placeholder="请输入描述内容" autosize={false} rows={4} />
              )}
            </Form.Item>
            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 8 }
              }}
            >
              <Button>取消</Button>
              <Button style={{ marginLeft: 50, marginTop: 60 }} type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

export default Form.create()(CreateMiniProgram);
