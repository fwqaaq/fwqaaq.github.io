---
date: 2023-11-15 17:16:44
title: Postgresql
categories: DataBase
tags:
  - Config
  - DataBase
summary: Postgresql 基础知识
---

## Postgres

> 安装请参见：<https://gist.github.com/fwqaaq/d2a4b7c63a062cdc739c592921867625>

FROM（确定表/视图） > JOIN（邻接 FROM 子句中的表） > WHERE（删选邻接之后的表） > GROUP BY（将数据分组以进行聚合计算） > HAVING（在数据分组和聚合之后对分组的结果筛选） > SELECT（选择要返回的列） > DISTINCT（删除重复的行） > ORDER BY（对结果进行排序） > LIMIT/OFFSET（限制返回的行数或跳过前面的行数）

### 单引号和双引号

> 双引号

在 postgres 中，标识符默认都当作小写（例如 FOO，则在 postgres 中则是 foo，`SELECT FOO FROM database;`）这里的 SQL 语句等同于 `SELECT foo FROM database;` 如果默认大写，则需要使用受限字符（""）`SELECT "FOO" FROM database;`

> 单引号

在 Postgres 中，使用单引号（''）包裹表示常量，例如（SELECT 'foo'）。

> $$

可以使用 $$ 表示多行字符串，以及嵌入引号

```sql
SELECT $$This is a
multiline "string"
using dollar-quoting.$$;
```

> ||

用于将两个字符串连接成一个字符串

```sql
SELECT first_name || ' ' || last_name AS full_name FROM users;
```

### 创建表单

```sql
CREATE TABLE table_name
(
column_name data_type column_constraint,
column_name data_type,
...,
table_constraint
);
```

* 所有的字段类型：<https://www.postgresql.org/docs/current/datatype.html>
* 所有的约束：<https://www.postgresql.org/docs/current/ddl-constraints.html>

> 字段级别的约束（column constraint）

* `NOT NULL`：非空约束，该字段的值不能为空（NULL）。
* `UNIQUE`：唯一约束，该字段每一行的值不能重复。不过，PostgreSQL 允许该字段存在多个 NULL 值，并且将它们看作不同的值。**需要注意的是 SQL 标准只允许 UNIQUE 字段中存在一个 NULL 值**。
* `PRIMARY KEY`：主键约束，包含了 NOT NULL 约束和 UNIQUE 约束。如果主键只包含一个字段，可以通过列级约束进行定义（参考上面的示例）；但是如果主键包含多个字段（复合主键）或者需要为主键指定一个自定义的名称，需要使用表级约束进行定义（参见下文示例）。
* `REFERENCES`：外键约束，字段中的值必需已经在另一个表中存在。外键用于定义两个表之间的参照完整性（referential integrity），例如，员工的部门编号字段必须是一个已经存在的部门。
* `CHECK`：检查约束，插入或更新数据时检查数据是否满足某个条件。例如，产品的价格必需大于零。
* `DEFAULT`：默认值，插入数据时，如果没有为这种列指定值，系统将会使用默认值代替。

> 表级别的约束（table constraint），`CONSTRAINT` 是声明一个约束的关键字，之后紧接约束的名称

* `UNIQUE(column1, …)`：唯一约束，括号中的字段值或字段值的组合必须唯一。
* `PRIMARY KEY(column1, …)`：主键约束，定义主键或者复合主键。
* `REFERENCES`：定义外键约束。
* `CHECK`：定义检查约束。

```sql
CREATE TABLE employees( 
  employee_id INTEGER NOT NULL,
  first_name CHARACTER VARYING(20),
  last_name CHARACTER VARYING(25) NOT NULL,
  email CHARACTER VARYING(25) NOT NULL,
  phone_number CHARACTER VARYING(20),
  hire_date DATE NOT NULL,
  salary NUMERIC(8,2),
  commission_pct NUMERIC(2,2),
  manager_id INTEGER,
  department_id INTEGER,
  CONSTRAINT emp_emp_id_pk PRIMARY KEY (employee_id), 
  CONSTRAINT emp_salary_min CHECK (salary > 0), 
  CONSTRAINT emp_email_uk UNIQUE (email), 
  CONSTRAINT emp_dept_fk FOREIGN KEY (department_id) REFERENCES departments(department_id), 
  CONSTRAINT emp_manager_fk FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);
```

### 视图

> 视图的概念：视图是基于 SQL 语句结果集的虚拟表。视图可以包含一个表的所有列或选定的几列，也可以来自一个或多个表，这取决于创建视图时所用的 SQL 查询。

```sql
CREATE VIEW department_average_salary AS
SELECT department, AVG(salary) AS average_salary
FROM employees
GROUP BY department;
```

视图作为虚拟表也可以像表一样使用，例如 JOIN、WHERE、GROUP BY、HAVING、ORDER BY 等。

* 使用视图可以简化复杂的查询：如果视图封装了复杂的逻辑，那么 JOIN 可以简化为单表查询。
* 安全性和封装性：仅暴露必要的数据，隐藏了底层表的结构。
* 可维护：如果改变了表中短发结构或者逻辑，只需改变视图的定义，而无需修改所有使用了该视图的查询。

* 注意⚠️：
  * 性能：由于每次查询都会执行视图定义中的 SQL 语句，因此性能可能会受到影响。
  * 依赖：如果视图依赖于其他视图，那么在修改底层表的结构时，可能会导致视图不可用。

### 索引

> 索引的概念：索引的主要目的就是为了加速查询操作，帮助数据库快速定位到表中的特定记录。索引是一种特殊的数据结构，它以某种方式引用表中的记录，以便于快速检索表中的特定信息。索引类似于书籍的目录，它们提供了关于数据的快速访问路径。

* B 树索引：这是最常见的索引类型，适用于等值查询和范围查询。
* 哈希索引：主要用于等值查询，不适用于排序或范围查找。
* GiST 索引：一种通用的搜索树，适用于多种不同类型的索引。
* GIN 索引：适用于包含多个值的字段，如数组或 JSON 对象。
* 空间索引：用于地理空间数据。

1. 创建单列索引（以及之下的多列索引，仅能是在 WHERE 操作中非常频繁的列）
  
   ```sql
   CREATE INDEX index_name ON table_name (column_name);
   ```

2. 创建多列索引

   ```sql
   CREATE INDEX index_name ON table_name (column1_name, column2_name);
   ```

3. 隐式索引：在创建**主键约束**或者**唯一约束**时，Postgres 会自动创建约束。如果有外键约束，最好也为外键创建索引。

**警告**⚠️：索引不能用于较小的表上；大批量的插入、更新和删除操作的表上；也不应该使用在含大量 NULL 值的列上。
