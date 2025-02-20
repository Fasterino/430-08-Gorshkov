namespace Teachers
{
    partial class TeachersForm
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            dataGridView1 = new DataGridView();
            LastName = new DataGridViewTextBoxColumn();
            FirstName = new DataGridViewTextBoxColumn();
            MiddleName = new DataGridViewTextBoxColumn();
            DisciplineCode = new DataGridViewTextBoxColumn();
            DisciplineName = new DataGridViewTextBoxColumn();
            button1 = new Button();
            button2 = new Button();
            ((System.ComponentModel.ISupportInitialize)dataGridView1).BeginInit();
            SuspendLayout();
            // 
            // dataGridView1
            // 
            dataGridView1.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            dataGridView1.Columns.AddRange(new DataGridViewColumn[] { LastName, FirstName, MiddleName, DisciplineCode, DisciplineName });
            dataGridView1.Location = new Point(12, 36);
            dataGridView1.Name = "dataGridView1";
            dataGridView1.Size = new Size(760, 513);
            dataGridView1.TabIndex = 10;
            dataGridView1.CellBeginEdit += dataGridView1_CellBeginEdit;
            dataGridView1.ColumnHeaderMouseClick += dataGridView1_ColumnHeaderMouseClick;
            dataGridView1.Sorted += dataGridView1_Sorted;
            // 
            // LastName
            // 
            LastName.DataPropertyName = "LastName";
            LastName.HeaderText = "Фамилия";
            LastName.MinimumWidth = 50;
            LastName.Name = "LastName";
            // 
            // FirstName
            // 
            FirstName.DataPropertyName = "FirstName";
            FirstName.HeaderText = "Имя";
            FirstName.MinimumWidth = 50;
            FirstName.Name = "FirstName";
            // 
            // MiddleName
            // 
            MiddleName.DataPropertyName = "MiddleName";
            MiddleName.HeaderText = "Отчество";
            MiddleName.MinimumWidth = 50;
            MiddleName.Name = "MiddleName";
            // 
            // DisciplineCode
            // 
            DisciplineCode.DataPropertyName = "DisciplineCode";
            DisciplineCode.FillWeight = 200F;
            DisciplineCode.HeaderText = "Код дисциплины";
            DisciplineCode.MinimumWidth = 50;
            DisciplineCode.Name = "DisciplineCode";
            DisciplineCode.Width = 200;
            // 
            // DisciplineName
            // 
            DisciplineName.DataPropertyName = "DisciplineName";
            DisciplineName.FillWeight = 200F;
            DisciplineName.HeaderText = "Имя дисциплины";
            DisciplineName.MinimumWidth = 50;
            DisciplineName.Name = "DisciplineName";
            DisciplineName.Width = 200;
            // 
            // button1
            // 
            button1.Location = new Point(12, 7);
            button1.Name = "button1";
            button1.Size = new Size(142, 23);
            button1.TabIndex = 11;
            button1.Text = "Сохранить";
            button1.UseVisualStyleBackColor = true;
            button1.Click += button1_Click;
            // 
            // button2
            // 
            button2.Location = new Point(160, 7);
            button2.Name = "button2";
            button2.Size = new Size(142, 23);
            button2.TabIndex = 12;
            button2.Text = "Загрузить";
            button2.UseVisualStyleBackColor = true;
            button2.Click += button2_Click;
            // 
            // TeachersForm
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(784, 561);
            Controls.Add(button2);
            Controls.Add(button1);
            Controls.Add(dataGridView1);
            MaximizeBox = false;
            MaximumSize = new Size(800, 600);
            MinimumSize = new Size(800, 600);
            Name = "TeachersForm";
            ShowIcon = false;
            Text = "Преподаватели";
            FormClosing += TeachersForm_FormClosing;
            ((System.ComponentModel.ISupportInitialize)dataGridView1).EndInit();
            ResumeLayout(false);
        }

        #endregion
        private DataGridView dataGridView1;
        private DataGridViewTextBoxColumn LastName;
        private DataGridViewTextBoxColumn FirstName;
        private DataGridViewTextBoxColumn MiddleName;
        private DataGridViewTextBoxColumn DisciplineCode;
        private DataGridViewTextBoxColumn DisciplineName;
        private Button button1;
        private Button button2;
    }
}
