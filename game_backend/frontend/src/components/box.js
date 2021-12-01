import React from 'react';
import styled, { css } from 'styled-components';
const Box = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 100%;
  background-color: transparent;
  border: 0;
  font-size: 3rem;
  padding: 0;
  height: 40px;
`;
const Cont = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;
const Value = styled.div`
  margin: 3px 8px 3px;
  padding: 4px 8px;
  min-width: 2rem;
  text-align: center;
  font-size: 1.5rem;
  line-height: 1rem;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;