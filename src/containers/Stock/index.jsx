import React from 'react';
import { useFormik } from 'formik';
import { Table, Space, Button, InputNumber } from 'antd';
import { useWindowSize } from 'react-use';
import { toast } from 'react-toastify';
import {
  Container,
  FixedTopBlock,
  FixedBottomBlock,
  TableBlock,
} from './styled';

const getStockId = index => `stock-${index + 1}`;

const getStockTitle = index => `No.${index + 1}`;

const getQuantityId = index => `quantity-${index + 1}`;

const LOCAL_STORAGE_KEY = {
  FORM: 'form',
};

const FIELD_NAME = {
  STOCKS: 'stocks',
  COLUMN_COUNT: 'columnCount',
};

const INITIAL_VALUES = {
  stocks: Array(30)
    .fill(0)
    .map((_, index) => ({
      id: getStockId(index),
      title: getStockTitle(index),
    })),
  columnCount: 1,
};
const Stock = () => {
  const { height: windowHeight } = useWindowSize();
  const cachedValues = window.localStorage.getItem(LOCAL_STORAGE_KEY.FORM);
  const formik = useFormik({
    initialValues: cachedValues ? JSON.parse(cachedValues) : INITIAL_VALUES,
  });

  const getStockIndex = stockId =>
    formik.values.stocks.findIndex(stock => stock.id === stockId);

  const handleQuantityAdd = (record, index) => () => {
    const stockIndex = getStockIndex(record.id);
    const quantityId = getQuantityId(index);
    const value = record[quantityId] || 0;
    const newValue = value + 1;
    formik.setFieldValue(
      `${FIELD_NAME.STOCKS}.${stockIndex}.${quantityId}`,
      newValue,
    );
  };

  const handleQuantityMinus = (record, index) => () => {
    const stockIndex = getStockIndex(record.id);
    const quantityId = getQuantityId(index);
    const value = record[quantityId] || 0;
    const newValue = value - 1;
    formik.setFieldValue(
      `${FIELD_NAME.STOCKS}.${stockIndex}.${quantityId}`,
      newValue > 0 ? newValue : 0,
    );
  };

  const handleQuantityChange = (record, index) => newValue => {
    const stockIndex = getStockIndex(record.id);
    const quantityId = getQuantityId(index);
    formik.setFieldValue(
      `${FIELD_NAME.STOCKS}.${stockIndex}.${quantityId}`,
      newValue,
    );
  };

  const handleCopyReport = () => {
    const stocks = formik.values.stocks?.filter(stock =>
      Array(formik.values.columnCount)
        .fill(0)
        .some((_, index) => stock[getQuantityId(index)] > 0),
    );
    const reportText = stocks.reduce((text, stock) => {
      return (
        (text +=
          `${stock.title}: ` +
          Array(formik.values.columnCount)
            .fill(0)
            .map((_, index) => `${stock[getQuantityId(index)] || 0}`)
            .join(' + ')) + '\n'
      );
    }, '');
    navigator.clipboard.writeText(reportText).then(() => {
      toast.success('報表已複製到剪貼簿');
    });
  };

  const handleCleanReport = () => {
    formik.setFieldValue(FIELD_NAME.STOCKS, INITIAL_VALUES.stocks);
  };

  const columns = [
    {
      key: 'title',
      dataIndex: 'title',
      title: '商品',
      width: 80,
    },
    ...Array(formik.values.columnCount)
      .fill(0)
      .map((_, index) => ({
        key: getStockId(index),
        title: `庫存 ${index + 1}`,
        render: record => (
          <Space>
            <Button onClick={handleQuantityMinus(record, index)}>-</Button>
            <InputNumber
              min={0}
              value={record[getQuantityId(index)] || 0}
              onChange={handleQuantityChange(record, index)}
            />
            <Button onClick={handleQuantityAdd(record, index)}>+</Button>
          </Space>
        ),
      })),
  ];

  React.useEffect(() => {
    formik.setFieldValue(
      FIELD_NAME.STOCKS,
      formik.values.stocks.map(stock => {
        const newStock = { ...stock };
        Array(formik.values.quantityCount)
          .fill(0)
          .forEach((_, index) => {
            const quantityId = getQuantityId(index);
            newStock[quantityId] = newStock[quantityId] || 0;
          });
        return newStock;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.quantityCount]);

  React.useEffect(() => {
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY.FORM,
      JSON.stringify(formik.values),
    );
  }, [JSON.stringify(formik.values)]);

  return (
    <Container>
      <FixedTopBlock>
        <Space>
          <Button
            onClick={() => {
              formik.setFieldValue(
                FIELD_NAME.COLUMN_COUNT,
                formik.values.columnCount + 1,
              );
            }}
          >
            新增庫存
          </Button>

          <Button
            danger
            onClick={() => {
              if (formik.values.columnCount > 1) {
                formik.setFieldValue(
                  FIELD_NAME.COLUMN_COUNT,
                  formik.values.columnCount - 1,
                );
              }
            }}
          >
            減少庫存
          </Button>
        </Space>
      </FixedTopBlock>

      <TableBlock>
        <Table
          columns={columns}
          dataSource={formik.values.stocks}
          pagination={false}
          scroll={{ y: windowHeight - 64 - 55 }}
        />
      </TableBlock>

      <FixedBottomBlock>
        <Space>
          <Button type="primary" onClick={handleCopyReport}>
            複製報表
          </Button>

          <Button onClick={handleCleanReport}>清空報表</Button>
        </Space>
      </FixedBottomBlock>
    </Container>
  );
};

export default Stock;
