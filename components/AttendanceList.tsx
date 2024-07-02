import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import Select, { SingleValue } from 'react-select';
import { format } from 'date-fns';
import { getAccessToken, refreshToken } from '../services/auth';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Class {
    id: number;
    year: number;
    class_name: string;
}

/**
interface Student {
    id: number;
    name: string;
    classId: number;
}
*/

interface AttendanceRecord {
    id: number;
    classId: number;
    year: number;
    month: number;
    studentId: number;
    date: Date;
    status: string;
}
  
type AttendanceStatus = '出席' | '欠席' | '出席停止' | '早退' | '遅刻' | 'その他';

const AttendanceList: React.FC = () => {
    const router = useRouter();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 0始まりなので+1
    const [selectedClass, setSelectedClass] = useState('');
    // const [students, setStudents] = useState<Student[]>([]);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  
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

    // クラス選択用のオプションを生成
    const classOptions = classes.map((cls) => ({
        value: cls.id.toString(),
        label: `${cls.class_name}`
    }));

    // 状態の追加
    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const [studentLoading, setStudentLoading] = useState(false);
    const [attendanceError, setAttendanceError] = useState(null);
    const [studentError, setStudentError] = useState(null);

    /**
    // useEffect内で状態を更新
    useEffect(() => {
        const fetchClasses = async () => {
            setStudentLoading(true); // 生徒の読み込み開始
            try {
                const response = await axios.get(`/api/students?classId=${selectedClass}`);
                if (response.status === 200) {
                    setStudents(response.data);
                    setStudentError(null);
                }
            } catch (error) {
                setStudentError(error);
            }
            setStudentLoading(false); // 生徒の読み込み終了
        };
        fetchClasses();
    }, [selectedClass]);
    */
    useEffect(() => {
        const fetchAttendanceRecords = async () => {
            setAttendanceLoading(true); // 出席簿の読み込み開始
            /**
            try {
                const response = await axios.get(
                    `/api/attendance-records?classId=${selectedClass}&year=${selectedYear}&month=${selectedMonth}`,
                );
                if (response.status === 200) {
                    setAttendanceRecords(response.data);
                    setAttendanceError(null);
                }
            } catch (error) {
                // setAttendanceError(error);
            }
            */
            setAttendanceLoading(false); // 出席簿の読み込み終了
        };
        fetchAttendanceRecords();
    }, [selectedClass, selectedYear, selectedMonth]);

    const setClassValue = () => {
        const classValue = classOptions.find((option) => option.value === selectedClass)
        if (classValue === undefined) {
            return null
        }
        return classValue
    }


    return (
        <div className="attendance-list">
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
          {/**
          {attendanceLoading || studentLoading ? (
            <div className="loading">読み込み中...</div>
          ) : attendanceError || studentError ? (
            <div className="error">エラーが発生しました。</div>
          ) : (
            <table className="attendance-table">
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
                    <td>{student.name}</td>
                    {attendanceRecords
                      .filter((record) => record.studentId === student.id)
                      .map((record) => (
                        <td
                          key={record.id}
                          className={record.status === '出席' ? 'attendance' : record.status}
                        >
                          {record.status === '出席' ? '○' : record.status}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          */}
        </div>
      );
      };
      
      export default AttendanceList;