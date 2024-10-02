import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { getAccessToken, refreshToken } from '../services/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AttendanceModalProps {
    date: string;
    childId: number;
    closeModal: () => void;
    refreshData: () => void;
    isAdmin: boolean;
}


export const AttendanceModal: React.FC<AttendanceModalProps> = ({ date, childId, closeModal, refreshData, isAdmin }) => {
    const [attendanceType, setAttendanceType] = useState('');
    const [otherDetails, setOtherDetails] = useState('');
    const [attendanceExists, setAttendanceExists] = useState(false); // 出欠情報が存在するかどうかのフラグ

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getAccessToken();
                const split_date_ary = date.split('/');
                const post_date = split_date_ary[0] + '-' + ('00' + split_date_ary[1]).slice(-2) + '-' + ('00' + split_date_ary[2]).slice(-2)

                const response = await axios.get(`${API_URL}/attendance-detail?childId=${childId}&date=${post_date}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const { attendance_type, other_details } = response.data;
                setAttendanceType(attendance_type);
                setOtherDetails(other_details || '');
                setAttendanceExists(true);
            } catch (error) {
                console.error('Error fetching attendance data:', error);
            }
        };

        fetchData();
    }, [childId, date]);

    const handleSave = async () => {
        const token = getAccessToken();

        const split_date_ary = date.split('/');
        const post_date = split_date_ary[0] + '-' + ('00' + split_date_ary[1]).slice(-2) + '-' + ('00' + split_date_ary[2]).slice(-2)

        const data = {
            'child': childId,
            'date': post_date,
            'attendance_type': attendanceType,
        };

        if (attendanceType === 'その他') {
            (data as any)['other_details'] = otherDetails;
        } else {
            (data as any)['other_details'] = '';
        }

        try {
            const response = await axios.post(`${API_URL}/attendance_post/`, 
                JSON.stringify(data),
                {
                    headers: {
                        'Content-type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            refreshData();
            closeModal();
        } catch (error) {
            console.error('Error saving attendance:', error);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm('本当に削除しますか？'); // 確認メッセージを追加
        if (!confirmDelete) return;

        const token = getAccessToken();

        const split_date_ary = date.split('/');
        const post_date = split_date_ary[0] + '-' + ('00' + split_date_ary[1]).slice(-2) + '-' + ('00' + split_date_ary[2]).slice(-2)

        try {
            await axios.delete(`${API_URL}/attendance-detail?childId=${childId}&date=${post_date}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            refreshData();
            closeModal();
        } catch (error) {
            console.error('Error deleting attendance:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-xl mb-4">出欠状況の編集</h2>
                <p>{date}</p>
                <select
                    value={attendanceType}
                    onChange={(e) => setAttendanceType(e.target.value)}
                    className="border p-2 mb-4"
                >
                    <option value="">選択してください</option>
                    <option value="出席">出席</option>
                    <option value="遅刻">遅刻</option>
                    <option value="早退">早退</option>
                    <option value="欠席">欠席</option>
                    <option value="出席停止">出席停止</option>
                    <option value="その他">その他</option>
                </select>
                {attendanceType === 'その他' && (
                    <input
                        type="text"
                        value={otherDetails}
                        onChange={(e) => setOtherDetails(e.target.value)}
                        className="border p-2 mb-4 w-full"
                        placeholder="詳細を入力してください"
                    />
                )}
                <div className="flex space-x-4">
                    <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">
                        保存
                    </button>
                    {isAdmin && attendanceExists && (
                        <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">
                            削除
                        </button>
                    )}
                    <button onClick={closeModal} className="bg-gray-500 text-white p-2 rounded">
                        キャンセル
                    </button>
                </div>
            </div>
        </div>
    );
};
