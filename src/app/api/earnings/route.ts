import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface DateList {
    date:Date | string,
    total : number
}

export async function GET(req:NextRequest) {
    const { searchParams } = new URL(req.url || '');

    try {
        const interval = searchParams.get('interval')
        const date = searchParams.get('date');

        let dateFormat = "";
        let dateCondition = "";
        let queryParams: any[] = [];
    
        if (!interval) {
            return NextResponse.json({ error: "Interval is required" });
        }
       
        let query : string = '';
        
        switch (interval) {
          case "year":
             if(!date){
                query = `
                    SELECT 
                        DATE_FORMAT(date, '%Y-%m') AS month,
                        SUM(total_amount) AS total_amount
                        FROM order_hexa
                        WHERE date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
                        GROUP BY month
                        ORDER BY month;
                `;
             } else{
                query = `
                    SELECT 
                        DATE_FORMAT(date, '%Y-%m') AS month,
                        SUM(total_amount) AS total_amount
                        FROM order_hexa
                        WHERE YEAR(date) = ?
                        GROUP BY month
                        ORDER BY month;
                `;
                queryParams = [date]
             }
            break;
    
          case "month":
             if(!date){
                query = `
                SELECT 
                    DATE_FORMAT(date, '%Y-%m-%d') AS day,
                    SUM(total_amount) AS total_amount
                    FROM order_hexa
                    WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                    GROUP BY day
                    ORDER BY day;`
             } else{
                query = `
                SELECT 
                    DATE_FORMAT(date, '%Y-%m-%d') AS day,
                    SUM(total_amount) AS total_amount
                    FROM order_hexa
                    WHERE DATE_FORMAT(date, '%m-%Y') = ?
                    GROUP BY day
                    ORDER BY day;
                `;
                queryParams = [date]
             }
            break;
    
          case "week":
            dateFormat = "%d %b"; // "28 Feb"
            if (date) {
              // Fetch data for the selected week (e.g., start date of week: "2024-02-20")
              dateCondition = "date BETWEEN ? AND DATE_ADD(?, INTERVAL 6 DAY)";
              queryParams.push(date, date);
            } else {
              // Default: Last 7 days
              dateCondition = "date >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
            }
            break;
    
          case "day":
            if(!date){
                query = `
                    SELECT 
                        DATE_FORMAT(date, '%Y-%m-%d %H:00:00') AS hour,
                        SUM(total_amount) AS total_amount
                        FROM order_hexa
                        WHERE date >= NOW() - INTERVAL 1 DAY
                        GROUP BY hour
                        ORDER BY hour;
                `
            } else{
                query = `
                SELECT DATE_FORMAT(date, '%Y-%m-%d %H:00:00') AS hour, SUM(total_amount) AS total_amount
                FROM order_hexa WHERE DATE_FORMAT(date, '%d-%m-%Y') = ?
                GROUP BY hour ORDER BY hour;
              `;
              queryParams = [date];
            }
            break;
    
          default:
            return NextResponse.json({ error: "Invalid interval" });
        }
    
        const [minDateResult] = await pool.query(`SELECT MIN(date) AS min_date FROM order_hexa`);
    
        const [rows] = await pool.query(query, queryParams);
        return NextResponse.json({min:minDateResult[0].min_date, data:rows});

      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error });
      }
}

// Handle POST requests
export async function POST() {
    return NextResponse.json({ message: 'Hello from POST' });
}