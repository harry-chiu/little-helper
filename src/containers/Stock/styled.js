import styled from 'styled-components';

export const Container = styled.div`
  max-height: 100%;
  overflow: hidden;

  .ant-input-number {
    width: 52px !important;
  }

  .ant-btn-default {
    padding: 4px 12px;
  }
`;

export const FixedTopBlock = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  width: 100%;
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
`;

export const FixedBottomBlock = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  width: 100%;
  height: 64px;
  background: #ffffff;
  border-top: 1px solid #f0f0f0;
`;

export const TableBlock = styled.div`
  padding-top: 64px;
  height: calc(100% - 64px);
`;
