import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import Select, { SingleValue } from 'react-select';
import { format } from 'date-fns';
import { getAccessToken, refreshToken } from '../services/auth';
import { useRouter } from 'next/navigation';
import styles from './AttendanceList.module.css';
import { AttendanceModal } from './AttendanceModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Class {
    id: number;
    year: number;
    class_name: string;
}

interface Student {
    id: number;
    class_info: number;
    student_info: {first_name: string, last_name: string}
}

interface AttendanceRecord {
    id: number;
    child: number;
    date: Date;
    attendance_type: string;
    absence_suspension_setting: number;
    arrival_time: string;
    departure_time: string;
    other_details: string;
    created_at: string;
    created_by: number;
    updated_at: string;
    updated_by: number;
}
  
type AttendanceStatus = '出席' | '欠席' | '出席停止' | '早退' | '遅刻' | 'その他';

const AttendanceList: React.FC = () => {
    const router = useRouter();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 0始まりなので+1
    const [selectedClass, setSelectedClass] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    // 年が選択されたときの処理
    const handleYearChange = (selectedYearOption: SingleValue<{ value: number; label: string; }>) => {
        if (selectedYearOption) {
            setSelectedYear(selectedYearOption.value);
        }
    };
  
    // 月が選択されたときの処理
    const handleMonthChange = (selectedMonthOption: SingleValue<{ value: number; label: string; }>) => {
        if (selectedMonthOption) {
            setSelectedMonth(selectedMonthOption.value);
        }
    };
  
    // クラスが選択されたときの処理
    const handleClassChange = (selectedClassOption: SingleValue<{ value: string; label: string; }>) => {
        if (selectedClassOption) {
            setSelectedClass(selectedClassOption.value);
        }
    };

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 10 }, (_, index) => ({
        value: currentYear - index,
        label: `${currentYear - index}年`
    }));
    const monthOptions = Array.from({ length: 12 }, (_, index) => ({
        value: index + 1,
        label: `${index + 1}月`
    }));

    // クラス一覧の状態を追加
    const [classes, setClasses] = useState<Class[]>([]);

    function getAcademicYear(year: number, month: number): number {
        if (month < 4) {
            return year - 1;
        } else {
            return year;
        }
    }

    // クラス一覧の取得
    useEffect(() => {
        const fetchClasses = async () => {
            const nendo = getAcademicYear(selectedYear, selectedMonth);
            const token = getAccessToken();
            try {
                const response = await axios.get(`${API_URL}/class-names/${nendo}/`, {
                    headers: {
                        'Content-type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    setClasses(response.data);
                    if (response.data.length > 0) {
                        setSelectedClass(response.data[0].id.toString()); // 初期クラスを1番目に表示
                    }
                }
            } catch(error) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 401) {
                    try {
                        await refreshToken();
                    } catch (error) {
                        router.push('/login')
                    }

                    fetchClasses();
                }
            }
        };
        fetchClasses();
    }, [selectedYear, selectedMonth, router]);

    // 園児一覧取得
    const [studentLoading, setStudentLoading] = useState(false);
    const [studentError, setStudentError] = useState(null);
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        const fetchChildren = async () => {
            const nendo = getAcademicYear(selectedYear, selectedMonth);
            const token = getAccessToken();

            setStudentLoading(true); // 生徒の読み込み開始
            try {
                const response = await axios.get(`${API_URL}/student-yearly-info-lists?year=${nendo}&class_id=${selectedClass}`, {
                    headers: {
                        'Content-type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    setStudents(response.data);
                    // const children_array = response.data;
                    // children_array.map((element: any) => console.log(element.student_info.first_name));
                    setStudentError(null);
                }
            } catch (error) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 401) {
                    try {
                        await refreshToken();
                    } catch (error) {
                        router.push('/login')
                    }

                    fetchChildren();
                }
            }
            setStudentLoading(false); // 生徒の読み込み終了
        };
        fetchChildren();
    }, [selectedYear, selectedMonth, selectedClass, router]);

    // クラス選択用のオプションを生成
    const classOptions = classes.map((cls) => ({
        value: cls.id.toString(),
        label: `${cls.class_name}`
    }));

    // 状態の追加
    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const [attendanceError, setAttendanceError] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    
    useEffect(() => {
        const fetchAttendanceRecords = async () => {
            setAttendanceLoading(true); // 生徒の読み込み開始
            
            const nendo = getAcademicYear(selectedYear, selectedMonth);
            const token = getAccessToken();
            try {
                const response = await axios.get(`${API_URL}/attendance-list?class_id=${selectedClass}&year=${selectedYear}&month=${selectedMonth}`, {
                    headers: {
                        'Content-type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    setAttendanceRecords(response.data);
                    setAttendanceError(null);
                }
            } catch (error) {
                router.push('/login')
            }
            setAttendanceLoading(false); // 生徒の読み込み終了
        };
        fetchAttendanceRecords();
    }, [selectedClass, selectedYear, selectedMonth, router]);

    const setClassValue = () => {
        const classValue = classOptions.find((option) => option.value === selectedClass)
        if (classValue === undefined) {
            return null
        }
        return classValue
    }

    const getDaysInMonth = (year: number, month: number): number => {
        return new Date(year, month, 0).getDate();
    };

    const [selectedDate, setSelectedDate] = useState<{ date: string; childId: number } | null>(null);

    const handleCellClick = (date: string, childId: number) => {
        setSelectedDate({ date, childId });
        setIsModalOpen(true); // モーダルを開く
    };

    return (
        <div >
            <h1>出席簿</h1>
            <div>
                <Select
                    value={yearOptions.find((option) => option.value === selectedYear)}
                    onChange={handleYearChange}
                    options={yearOptions}
                    placeholder="年を選択"
                />
                <Select
                    value={monthOptions.find((option) => option.value === selectedMonth)}
                    onChange={handleMonthChange}
                    options={monthOptions}
                    placeholder="月を選択"
                />
                <Select
                    value={setClassValue()}
                    onChange={handleClassChange}
                    options={classOptions}
                    placeholder="クラスを選択"
                />
            </div>
          {
            attendanceLoading || studentLoading ? (
            <div className="loading">読み込み中...</div>
          ) : attendanceError || studentError ? (
            <div className="error">エラーが発生しました。</div>
          ) : (
            <div className={styles.table_container}>
                <table className={styles.attendance_list}>
                    <thead>
                        <tr>
                            <th>生徒名</th>
                            {Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1).map((
                                day
                            ) => (
                                <th key={day}>{format(new Date(selectedYear, selectedMonth - 1, day), 'd')}</th>
                            ))}
                        </tr>
                    </thead>
                <tbody>
                    {students.map((student) => (
                    <tr key={student.id}>
                        <td>{student.student_info.first_name + ' ' + student.student_info.last_name}</td>
                        {Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => {
                            const day = i + 1;
                            const set_date = selectedYear + '/' + selectedMonth + '/' + day;
                            const record = attendanceRecords.find(
                                (record) => record.child === student.id && new Date(record.date).getDate() === day
                            );
                            return (
                                <td key={day} className={record ? record.attendance_type : ''} onClick={() => handleCellClick(set_date, student.id)}>
                                    {record ? (
                                        <span title={record.attendance_type === 'その他' ? record.other_details : ''}>
                                            {record.attendance_type === '出席' ? '○' :
                                            record.attendance_type === '遅刻' ? '遅' :
                                            record.attendance_type === '早退' ? '早' :
                                            record.attendance_type === '出席停止' ? '停' :
                                            record.attendance_type === '欠席' ? '欠' :
                                            record.attendance_type === 'その他' ? '他' :
                                            record.attendance_type}
                                        </span>
                                    ) : ''}
                                </td>
                            );
                        })}
                    </tr>
                    ))}
                </tbody>
                </table>
                {isModalOpen && selectedDate && (
                    <AttendanceModal
                        isAdmin={true}
                        date={selectedDate.date} // Date型をstring型に変換
                        childId={selectedDate.childId}
                        closeModal={() => setIsModalOpen(false)}
                        refreshData={() => {
                            const fetchAttendanceRecords = async () => {
                                setAttendanceLoading(true); // 生徒の読み込み開始
                                
                                const nendo = getAcademicYear(selectedYear, selectedMonth);
                                const token = getAccessToken();
                                try {
                                    const response = await axios.get(`${API_URL}/attendance-list?class_id=${selectedClass}&year=${selectedYear}&month=${selectedMonth}`, {
                                        headers: {
                                            'Content-type': 'application/json',
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${token}`,
                                        },
                                    });
                                    if (response.status === 200) {
                                        setAttendanceRecords(response.data);
                                        setAttendanceError(null);
                                    }
                                } catch (error) {
                                    router.push('/login')
                                }
                                setAttendanceLoading(false); // 生徒の読み込み終了
                            };
                            fetchAttendanceRecords();
                        }}
                    />
                )}
            </div>
          )}
        </div>
      );
      };
      
      export default AttendanceList;