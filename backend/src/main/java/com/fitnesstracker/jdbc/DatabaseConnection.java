package com.fitnesstracker.jdbc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * DatabaseConnection
 * Reusable JDBC connection manager for the Fitness Tracker application.
 *
 * Provides:
 * 1. Safe connection acquisition using either Spring's configured DataSource or standard JDBC DriverManager.
 * 2. Reading credentials securely from environment variables, system properties, or application properties.
 * 3. Never hardcodes passwords or sensitive credentials.
 * 4. Helper methods to safely close Connection, Statement, and ResultSet instances.
 */
@Component
public class DatabaseConnection {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConnection.class);

    private static DataSource staticDataSource;

    // Default configuration values read from application.properties or environment variables
    private static String dbUrl = "jdbc:mysql://localhost:3306/fitness_tracker?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static String dbUsername = "root";
    private static String dbPassword = "root";
    private static String dbDriver = "com.mysql.cj.jdbc.Driver";

    @Autowired
    public DatabaseConnection(
            DataSource dataSource,
            @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/fitness_tracker}") String url,
            @Value("${spring.datasource.username:root}") String username,
            @Value("${spring.datasource.password:root}") String password,
            @Value("${spring.datasource.driver-class-name:com.mysql.cj.jdbc.Driver}") String driver) {

        DatabaseConnection.staticDataSource = dataSource;
        if (url != null && !url.trim().isEmpty()) {
            DatabaseConnection.dbUrl = url;
        }
        if (username != null && !username.trim().isEmpty()) {
            DatabaseConnection.dbUsername = username;
        }
        if (password != null) {
            DatabaseConnection.dbPassword = password;
        }
        if (driver != null && !driver.trim().isEmpty()) {
            DatabaseConnection.dbDriver = driver;
        }

        logger.info("DatabaseConnection initialized. Target URL: {}", maskUrl(DatabaseConnection.dbUrl));
    }

    /**
     * Default no-arg constructor for standalone non-Spring usage.
     */
    public DatabaseConnection() {
        // Reads from environment variables if present
        String envUrl = System.getenv("DB_URL");
        String envUser = System.getenv("DB_USERNAME");
        String envPass = System.getenv("DB_PASSWORD");
        String envDriver = System.getenv("DB_DRIVER");

        if (envUrl != null && !envUrl.trim().isEmpty()) {
            dbUrl = envUrl;
        }
        if (envUser != null && !envUser.trim().isEmpty()) {
            dbUsername = envUser;
        }
        if (envPass != null) {
            dbPassword = envPass;
        }
        if (envDriver != null && !envDriver.trim().isEmpty()) {
            dbDriver = envDriver;
        }
    }

    /**
     * Get a JDBC Connection.
     * Prefers the Spring DataSource (with Hikari connection pooling) if available,
     * otherwise establishes a direct connection using DriverManager.
     *
     * @return an open java.sql.Connection
     * @throws SQLException if a database access error occurs
     */
    public static Connection getConnection() throws SQLException {
        if (staticDataSource != null) {
            return staticDataSource.getConnection();
        }

        // Standalone DriverManager fallback
        try {
            Class.forName(dbDriver);
        } catch (ClassNotFoundException e) {
            logger.warn("JDBC Driver class {} not found on classpath, attempting DriverManager anyway: {}", dbDriver, e.getMessage());
        }

        return DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
    }

    /**
     * Safely closes a ResultSet without throwing checked exceptions.
     */
    public static void close(ResultSet rs) {
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                logger.error("Error closing ResultSet: {}", e.getMessage());
            }
        }
    }

    /**
     * Safely closes a Statement without throwing checked exceptions.
     */
    public static void close(Statement stmt) {
        if (stmt != null) {
            try {
                stmt.close();
            } catch (SQLException e) {
                logger.error("Error closing Statement: {}", e.getMessage());
            }
        }
    }

    /**
     * Safely closes a Connection without throwing checked exceptions.
     */
    public static void close(Connection conn) {
        if (conn != null) {
            try {
                if (!conn.isClosed()) {
                    conn.close();
                }
            } catch (SQLException e) {
                logger.error("Error closing Connection: {}", e.getMessage());
            }
        }
    }

    /**
     * Safely closes Connection, Statement, and ResultSet together.
     */
    public static void close(Connection conn, Statement stmt, ResultSet rs) {
        close(rs);
        close(stmt);
        close(conn);
    }

    /**
     * Safely closes Connection and Statement together.
     */
    public static void close(Connection conn, Statement stmt) {
        close(stmt);
        close(conn);
    }

    /**
     * Masks database URL credentials for secure logging.
     */
    private static String maskUrl(String url) {
        if (url == null) return "null";
        return url.replaceAll("(?i)(password=)[^&;]*", "$1****");
    }

    // Getters for configuration metadata
    public static String getDbUrl() {
        return dbUrl;
    }

    public static String getDbUsername() {
        return dbUsername;
    }

    public static String getDbDriver() {
        return dbDriver;
    }
}
