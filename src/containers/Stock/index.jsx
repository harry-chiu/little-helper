import React from 'react';
import { useFormik } from 'formik';
import { Table, Space, Button, InputNumber } from 'antd';
import { useWindowSize } from 'react-use';
import { toast } from 'react-toastify';
import { Container, FixedBottomBlock } from './styled';

const FIELD_NAME = {
  STOCKS: 'stocks',
};

const INITIAL_VALUES = {
  stocks: Array(50)
    .fill(0)
    .map((_, index) => ({
      id: index,
      title: `No.${index + 1}`,
      quantity1: 0,
      quantity2: 0,
    })),
};

const Stock = () => {
  const { height: windowHeight } = useWindowSize();
  const formik = useFormik({ initialValues: INITIAL_VALUES });

  const handleQuantity1Add = record => () => {
    formik.setFieldValue(
      `${FIELD_NAME.STOCKS}.${record.id}.quantity1`,
      record.quantity1 + 1,
    );
  };

  const handleQuantity1Minus = record => () => {
    const newValue = record.quantity1 - 1;
    formik.setFieldValue(
      `${FIELD_NAME.STOCKS}.${record.id}.quantity1`,
      newValue > 0 ? newValue : 0,
    );
  };

  const handleQuantity2Add = record => () => {
    formik.setFieldValue(
      `${FIELD_NAME.STOCKS}.${record.id}.quantity2`,
      record.quantity2 + 1,
    );
  };

  const handleQuantity2Minus = record => () => {
    const newValue = record.quantity2 - 1;
    formik.setFieldValue(
      `${FIELD_NAME.STOCKS}.${record.id}.quantity2`,
      newValue > 0 ? newValue : 0,
    );
  };

  const handleReportText = () => {
    const stocks = formik.values.stocks?.filter(
      stock => stock.quantity1 || stock.quantity2,
    );
    const reportText = stocks.reduce(
      (text, stock) =>
        (text += `${stock.title}: ${stock.quantity1} + ${stock.quantity2}\n`),
      '',
    );
    navigator.clipboard.writeText(reportText).then(() => {
      toast.success('報表已複製到剪貼簿');
    });
  };

  const columns = [
    {
      key: 'title',
      dataIndex: 'title',
      title: '商品',
      width: 80,
    },
    {
      key: 'stock-1',
      title: '庫存 1',
      render: record => (
        <Space>
          <Button onClick={handleQuantity1Minus(record)}>-</Button>
          <InputNumber min={0} value={record.quantity1} />
          <Button onClick={handleQuantity1Add(record)}>+</Button>
        </Space>
      ),
    },
    {
      key: 'stock-2',
      title: '庫存 2',
      render: record => (
        <Space>
          <Button onClick={handleQuantity2Minus(record)}>-</Button>
          <InputNumber min={0} value={record.quantity2} />
          <Button onClick={handleQuantity2Add(record)}>+</Button>
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <Table
        columns={columns}
        dataSource={formik.values.stocks}
        pagination={false}
        scroll={{ y: windowHeight - 64 - 55 }}
      />

      <FixedBottomBlock>
        <Button type="primary" onClick={handleReportText}>
          複製報表
        </Button>
      </FixedBottomBlock>
    </Container>
  );
};

export default Stock;
