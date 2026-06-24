import React, { useEffect, useState } from 'react';
import { 
  Row, Col, Typography, Card, Select, DatePicker, Button, Table, 
  Statistic, Empty, Spin, message, Divider, Tag
} from 'antd';
import { 
  FilePdfOutlined, FileExcelOutlined, FileTextOutlined, 
  EyeOutlined, DownloadOutlined, ReloadOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReportPreview, fetchReportHistory, exportReportFile, clearPreview } from '../../store/reportSlice';
import { formatCurrency } from '../../utils/currencyFormatter';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const REPORT_TYPES = [
  'Executive Summary',
  'Monthly',
  'Yearly',
  'Transactions',
  'Budgets',
  'Goals',
  'Analytics',
  'Financial Health'
];

const Reports = () => {
  const dispatch = useDispatch();
  const { preview, history, loading, exportLoading, error } = useSelector(state => state.reports);

  const [reportType, setReportType] = useState('Executive Summary');
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);
  const [exportFormat, setExportFormat] = useState(null); // tracking format for loading state

  useEffect(() => {
    dispatch(fetchReportHistory());
    return () => {
      dispatch(clearPreview());
    };
  }, [dispatch]);

  const handlePreview = () => {
    if (!reportType || !dateRange) {
      message.warning('Please select a report type and date range.');
      return;
    }

    const filters = {
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD')
    };

    dispatch(fetchReportPreview({ reportType, filters }));
  };

  const handleExport = async (format) => {
    if (!reportType || !dateRange) {
      message.warning('Please select a report type and date range.');
      return;
    }

    setExportFormat(format);
    const filters = {
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD')
    };

    try {
      await dispatch(exportReportFile({ format, reportType, filters })).unwrap();
      message.success(`${format.toUpperCase()} generated and downloaded successfully!`);
      // Refresh history
      dispatch(fetchReportHistory());
    } catch (err) {
      message.error(err || 'Failed to export report.');
    } finally {
      setExportFormat(null);
    }
  };

  const handleReDownload = (record) => {
    const filters = {
      startDate: record.filters.startDate,
      endDate: record.filters.endDate
    };
    
    // Quick trick: if it was a PDF, trigger a PDF download again
    dispatch(exportReportFile({ format: record.format.toLowerCase(), reportType: record.reportType, filters }))
      .unwrap()
      .then(() => message.success(`Downloaded ${record.fileName}`))
      .catch((err) => message.error(err || 'Failed to redownload'));
  };

  const historyColumns = [
    {
      title: 'Report Name',
      dataIndex: 'fileName',
      key: 'fileName',
      render: text => <span className="font-medium text-blue-600 dark:text-blue-400">{text}</span>
    },
    {
      title: 'Type',
      dataIndex: 'reportType',
      key: 'reportType',
    },
    {
      title: 'Format',
      dataIndex: 'format',
      key: 'format',
      render: format => {
        let color = 'default';
        if (format === 'PDF') color = 'red';
        if (format === 'Excel') color = 'green';
        if (format === 'CSV') color = 'blue';
        return <Tag color={color}>{format}</Tag>;
      }
    },
    {
      title: 'Generated Date',
      dataIndex: 'generatedAt',
      key: 'generatedAt',
      render: date => dayjs(date).format('MMM D, YYYY HH:mm')
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" icon={<DownloadOutlined />} onClick={() => handleReDownload(record)}>
          Re-download
        </Button>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6 px-4">
      <div>
        <Title level={2} className="!mb-1 dark:text-white">Reports & Exports</Title>
        <Text className="text-gray-500 dark:text-gray-400">Generate professional financial summaries and data exports.</Text>
      </div>

      <Row gutter={[16, 16]}>
        {/* Left Column: Generator */}
        <Col xs={24} lg={8} className="space-y-6">
          <Card title="Report Generator" className="shadow-sm">
            <div className="space-y-4">
              <div>
                <div className="mb-1 text-sm font-medium">Report Type</div>
                <Select 
                  className="w-full" 
                  value={reportType} 
                  onChange={setReportType}
                >
                  {REPORT_TYPES.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </div>

              <div>
                <div className="mb-1 text-sm font-medium">Date Range</div>
                <RangePicker 
                  className="w-full" 
                  value={dateRange}
                  onChange={setDateRange}
                  allowClear={false}
                />
              </div>

              <Button 
                type="primary" 
                block 
                icon={<EyeOutlined />} 
                onClick={handlePreview}
                loading={loading && !exportFormat}
              >
                Generate Preview
              </Button>
            </div>
          </Card>

          <Card title="Export Options" className="shadow-sm">
            <div className="space-y-3">
              <Button 
                block 
                danger
                icon={<FilePdfOutlined />} 
                onClick={() => handleExport('pdf')}
                loading={exportFormat === 'pdf'}
                disabled={!preview || exportLoading}
              >
                {exportFormat === 'pdf' ? 'Generating PDF...' : 'Download as PDF'}
              </Button>
              <Button 
                block 
                className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                icon={<FileExcelOutlined />} 
                onClick={() => handleExport('excel')}
                loading={exportFormat === 'excel'}
                disabled={!preview || exportLoading}
              >
                {exportFormat === 'excel' ? 'Preparing Excel...' : 'Download as Excel'}
              </Button>
              <Button 
                block 
                className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                icon={<FileTextOutlined />} 
                onClick={() => handleExport('csv')}
                loading={exportFormat === 'csv'}
                disabled={!preview || exportLoading}
              >
                {exportFormat === 'csv' ? 'Streaming CSV...' : 'Download as CSV'}
              </Button>
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
              Generate a preview first to enable exports. Data in exports perfectly matches the preview.
            </div>
          </Card>
        </Col>

        {/* Right Column: Preview & History */}
        <Col xs={24} lg={16} className="space-y-6">
          <Card 
            title="Report Preview" 
            className="shadow-sm min-h-[300px]"
            extra={preview && <Tag color="blue">{preview.totalRecords} Transactions</Tag>}
          >
            {loading && !exportFormat ? (
              <div className="flex justify-center items-center h-48"><Spin size="large" tip="Calculating data..." /></div>
            ) : !preview ? (
              <Empty description="Select options and click Generate Preview to view statistics before exporting." />
            ) : (
              <div className="space-y-6">
                <Row gutter={[16, 16]}>
                  <Col xs={12} sm={8}>
                    <Statistic title="Total Income" value={preview.totalIncome} prefix="₹" valueStyle={{ color: '#52c41a' }} />
                  </Col>
                  <Col xs={12} sm={8}>
                    <Statistic title="Total Expenses" value={preview.totalExpenses} prefix="₹" valueStyle={{ color: '#f5222d' }} />
                  </Col>
                  <Col xs={12} sm={8}>
                    <Statistic title="Net Savings" value={preview.netSavings} prefix="₹" valueStyle={{ color: preview.netSavings >= 0 ? '#1677ff' : '#f5222d' }} />
                  </Col>
                </Row>

                {preview.reportType === 'Executive Summary' && (
                  <>
                    <Divider />
                    <Title level={5}>Executive Insights</Title>
                    <Row gutter={[16, 16]}>
                      <Col xs={12} sm={8}>
                        <Statistic title="Financial Health" value={preview.healthScore} suffix="/100" />
                      </Col>
                      <Col xs={12} sm={8}>
                        <Statistic title="Active Goals" value={preview.goalProgress?.activeGoals || 0} />
                      </Col>
                      <Col xs={12} sm={8}>
                        <Statistic title="Goal Achievement Rate" value={preview.goalProgress?.achievementRate || 0} suffix="%" />
                      </Col>
                    </Row>
                  </>
                )}

                <Divider />
                <Title level={5}>Transaction Sample (First 5)</Title>
                <Table 
                  dataSource={preview.transactions.slice(0, 5)}
                  columns={[
                    { title: 'Date', dataIndex: 'date', key: 'date' },
                    { title: 'Type', dataIndex: 'type', key: 'type', render: t => <Tag color={t === 'income' ? 'green' : 'red'}>{t}</Tag> },
                    { title: 'Category', dataIndex: 'category', key: 'category' },
                    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: amt => formatCurrency(amt) },
                  ]}
                  pagination={false}
                  size="small"
                  rowKey={(_, idx) => idx}
                />
              </div>
            )}
          </Card>

          <Card title="Export Audit History" className="shadow-sm" extra={<Button type="text" icon={<ReloadOutlined />} onClick={() => dispatch(fetchReportHistory())}>Refresh</Button>}>
            <Table 
              dataSource={history}
              columns={historyColumns}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              scroll={{ x: true }}
              loading={loading && history.length === 0}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
