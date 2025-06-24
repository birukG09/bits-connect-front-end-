// GPA Calculator management
class GPAManager {
    constructor() {
        this.semesters = Utils.getFromStorage('semesters', []);
        this.currentSemester = {
            id: 'current',
            name: 'Fall 2024',
            courses: [],
            gpa: 0
        };
        
        this.gradePoints = {
            'A+': 4.0, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D+': 1.3, 'D': 1.0, 'F': 0.0
        };
    }
    
    initialize() {
        this.bindEvents();
        this.updateStats();
        this.renderCourses();
    }
    
    bindEvents() {
        const addCourseBtn = document.getElementById('add-course-btn');
        const saveSemesterBtn = document.getElementById('save-semester-btn');
        const semesterNameInput = document.getElementById('semester-name');
        
        if (addCourseBtn) {
            addCourseBtn.addEventListener('click', () => this.addCourse());
        }
        
        if (saveSemesterBtn) {
            saveSemesterBtn.addEventListener('click', () => this.saveSemester());
        }
        
        if (semesterNameInput) {
            semesterNameInput.addEventListener('input', (e) => {
                this.currentSemester.name = e.target.value;
            });
        }
    }
    
    addCourse() {
        const newCourse = {
            id: Utils.generateId(),
            name: '',
            credits: 3,
            grade: 'A',
            points: 4.0
        };
        
        this.currentSemester.courses.push(newCourse);
        this.renderCourses();
        this.updateCurrentGPA();
    }
    
    updateCourse(courseId, field, value) {
        const course = this.currentSemester.courses.find(c => c.id === courseId);
        if (course) {
            course[field] = value;
            
            if (field === 'grade') {
                course.points = this.gradePoints[value];
            }
            
            this.updateCurrentGPA();
        }
    }
    
    removeCourse(courseId) {
        this.currentSemester.courses = this.currentSemester.courses.filter(c => c.id !== courseId);
        this.renderCourses();
        this.updateCurrentGPA();
    }
    
    calculateGPA(courses) {
        if (courses.length === 0) return 0;
        
        const totalPoints = courses.reduce((sum, course) => sum + (course.points * course.credits), 0);
        const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
        
        return totalCredits > 0 ? totalPoints / totalCredits : 0;
    }
    
    updateCurrentGPA() {
        const currentGPA = this.calculateGPA(this.currentSemester.courses);
        this.currentSemester.gpa = currentGPA;
        
        // Update display
        const gpaValue = document.querySelector('.gpa-value');
        if (gpaValue) {
            gpaValue.textContent = currentGPA.toFixed(2);
        }
        
        this.updateStats();
    }
    
    updateStats() {
        const allCourses = [
            ...this.semesters.flatMap(sem => sem.courses),
            ...this.currentSemester.courses
        ];
        
        const cumulativeGPA = this.calculateGPA(allCourses);
        const currentGPA = this.calculateGPA(this.currentSemester.courses);
        
        // Update stat cards
        const cumulativeGPAEl = document.getElementById('cumulative-gpa');
        const currentGPAEl = document.getElementById('current-gpa');
        const totalSemestersEl = document.getElementById('total-semesters');
        const totalCoursesEl = document.getElementById('total-courses');
        
        if (cumulativeGPAEl) cumulativeGPAEl.textContent = cumulativeGPA.toFixed(2);
        if (currentGPAEl) currentGPAEl.textContent = currentGPA.toFixed(2);
        if (totalSemestersEl) totalSemestersEl.textContent = this.semesters.length;
        if (totalCoursesEl) totalCoursesEl.textContent = allCourses.length;
    }
    
    renderCourses() {
        const container = document.getElementById('courses-list');
        if (!container) return;
        
        if (this.currentSemester.courses.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 text-white/50">
                    <i class="fas fa-book-open text-6xl mb-4"></i>
                    <p>No courses added yet. Click "Add Course" to get started.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.currentSemester.courses.map(course => `
            <div class="course-item">
                <input 
                    type="text" 
                    value="${course.name}" 
                    placeholder="Course name"
                    onchange="gpaManager.updateCourse('${course.id}', 'name', this.value)"
                >
                <input 
                    type="number" 
                    value="${course.credits}" 
                    min="1" 
                    max="6"
                    onchange="gpaManager.updateCourse('${course.id}', 'credits', parseInt(this.value))"
                >
                <select onchange="gpaManager.updateCourse('${course.id}', 'grade', this.value)">
                    ${Object.keys(this.gradePoints).map(grade => `
                        <option value="${grade}" ${course.grade === grade ? 'selected' : ''}>${grade}</option>
                    `).join('')}
                </select>
                <span class="text-white/70 text-sm">${course.points.toFixed(1)}</span>
                <button class="btn btn-icon" onclick="gpaManager.removeCourse('${course.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    saveSemester() {
        if (this.currentSemester.courses.length === 0) {
            Utils.showToast('Please add at least one course', 'error');
            return;
        }
        
        const completedSemester = {
            ...this.currentSemester,
            id: Utils.generateId(),
            completedAt: new Date().toISOString()
        };
        
        this.semesters.push(completedSemester);
        Utils.saveToStorage('semesters', this.semesters);
        
        // Reset current semester
        this.currentSemester = {
            id: 'current',
            name: `Semester ${this.semesters.length + 1}`,
            courses: [],
            gpa: 0
        };
        
        // Update UI
        document.getElementById('semester-name').value = this.currentSemester.name;
        this.renderCourses();
        this.updateStats();
        
        Utils.showToast('Semester saved successfully!', 'success');
    }
    
    exportPDF() {
        Utils.showToast('GPA report exported successfully!', 'success');
        // In a real app, this would generate and download a PDF report
    }
    
    getSemesters() {
        return this.semesters;
    }
    
    getCurrentSemester() {
        return this.currentSemester;
    }
}

// Initialize GPA manager
window.gpaManager = new GPAManager();