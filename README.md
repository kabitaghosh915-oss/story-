# story-
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>অমূল্য গল্পের ঝুড়ি | OmniTales</title>
    
    <!-- Firebase SDKs -->
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>

    <style>
        /* --- CSS VARIABLES & RESET --- */
        :root {
            --bg-color: #080810;
            --card-bg: rgba(20, 20, 35, 0.6);
            --text-color: #e0e0e0;
            --muted-color: #94a3b8;
            --accent-cyan: #00f2fe;
            --accent-purple: #4facfe;
            --border-color: rgba(255, 255, 255, 0.08);
            --glass: blur(20px) saturate(180%);
            --font-main: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            --font-bengali: 'Nirmala UI', 'Kalpurush', sans-serif; /* Fallback system fonts */
            --header-height: 60px;
            --nav-height: 65px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: var(--font-main);
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            overflow-x: hidden;
            padding-top: var(--header-height);
            padding-bottom: var(--nav-height);
            line-height: 1.6;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        /* --- SCROLLBAR --- */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg-color); }
        ::-webkit-scrollbar-thumb { background: var(--accent-purple); border-radius: 3px; }

        /* --- UTILITIES --- */
        .container { width: 92%; max-width: 1200px; margin: 0 auto; }
        .hidden { display: none !important; }
        .GlassMorphism {
            background: var(--card-bg);
            -webkit-backdrop-filter: var(--glass);
            backdrop-filter: var(--glass);
            border: 1px solid var(--border-color);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
        }
        .btn {
            padding: 10px 20px;
            border-radius: 50px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            font-size: 0.9rem;
        }
        .btn-primary {
            background: linear-gradient(135deg, var(--accent-purple), var(--accent-cyan));
            color: white;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(79, 172, 254, 0.4); }
        .btn-secondary { background: rgba(255,255,255,0.05); color: var(--text-color); border: 1px solid var(--border-color); }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); }
        .section-title { font-size: 1.8rem; margin-bottom: 1.5rem; background: linear-gradient(to right, #fff, var(--muted-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;}
        
        /* --- HEADER --- */
        .header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: var(--header-height);
            z-index: 1000;
            display: flex;
            align-items: center;
            border-bottom: 1px solid var(--border-color);
            background: rgba(8, 8, 16, 0.8);
            -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
        }
        .header .container { display: flex; justify-content: space-between; align-items: center; }
        .logo {
            font-size: 1.3rem;
            font-weight: 800;
            background: linear-gradient(90deg, var(--accent-cyan), var(--accent-purple));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-decoration: none;
            font-family: var(--font-bengali);
        }

        /* --- MAIN CONTENT AREA --- */
        main { flex: 1; padding: 20px 0; }
        .tab-view { display: none; opacity: 0; transition: opacity 0.3s ease; }
        .tab-view.active { display: block; opacity: 1; }

        /* --- TAB 1: LIBRARY --- */
        #hero { text-align: center; padding: 40px 0; margin-bottom: 20px; border-radius: 20px; position: relative; overflow: hidden; }
        #hero::before {
            content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
            background: radial-gradient(circle, rgba(79, 172, 254, 0.1) 0%, rgba(8, 8, 16, 0) 70%);
            z-index: -1;
        }
        #hero h1 { font-size: 2.5rem; margin-bottom: 10px; font-family: var(--font-bengali); }
        #hero p { color: var(--muted-color); max-width: 600px; margin: 0 auto 20px; font-size: 1rem; }
        
        .controls-bar {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 20px; gap: 15px; flex-wrap: wrap; padding: 10px; border-radius: 10px;
        }
        .filter-group { display: flex; gap: 10px; flex-wrap: wrap; }
        .sort-select {
            padding: 8px 15px; border-radius: 8px; background: var(--card-bg);
            border: 1px solid var(--border-color); color: var(--text-color); outline: none; cursor: pointer;
        }
        .sort-select option { background: #080810; }

        .story-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        }
        .story-card {
            border-radius: 16px; overflow: hidden; cursor: pointer;
            display: flex; flex-direction: column; transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid var(--border-color); position: relative; background: var(--card-bg);
        }
        .story-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .card-cover { width: 100%; height: 140px; background-size: cover; background-position: center; border-bottom: 1px solid var(--border-color); }
        .card-body { padding: 15px; flex: 1; display: flex; flex-direction: column; }
        .card-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 5px; font-family: var(--font-bengali); line-height: 1.3; }
        .card-author { font-size: 0.85rem; color: var(--accent-cyan); margin-bottom: 8px; }
        .card-meta {
            margin-top: auto; padding-top: 10px; border-top: 1px solid var(--border-color);
            display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--muted-color);
        }
        .card-stats { display: flex; gap: 10px; align-items: center; }
        .icon-stat { display: inline-flex; align-items: center; gap: 4px; }

        /* --- READER VIEW --- */
        #reader-view {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: var(--bg-color); z-index: 2000; overflow-y: auto;
            display: none; padding: 20px;
        }
        #reader-view.active { display: block; }
        .reader-container { max-width: 800px; margin: 0 auto; padding-bottom: 100px; }
        
        .reader-header {
            margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color);
            position: sticky; top: 0; background: var(--bg-color); padding-top: 10px; z-index: 10;
        }
        .reader-title { font-size: 2.5rem; margin-bottom: 10px; font-family: var(--font-bengali); }
        .reader-info { display: flex; justify-content: space-between; color: var(--muted-color); font-size: 0.9rem; flex-wrap: wrap; gap: 10px;}
        
        #reader-content {
            font-size: 1.1rem; line-height: 1.8; color: var(--text-color);
            font-family: var(--font-bengali), serif; /* Prefer serif for reading */
            /* Anti-Copy */
            -webkit-user-select: none; /* Safari */
            -ms-user-select: none; /* IE 10+ and Edge */
            user-select: none;      
        }
        #reader-content p { margin-bottom: 1.5em; text-align: justify; }

        .reader-tools-floating {
            position: fixed; bottom: 90px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 100;
        }
        .tool-btn {
            width: 45px; height: 45px; border-radius: 50%; border: none; cursor: pointer;
            background: var(--card-bg); color: white; font-size: 1.2rem; display: grid; place-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3); -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px);
            border: 1px solid var(--border-color); transition: all 0.2s;
        }
        .tool-btn:hover { background: rgba(255,255,255,0.1); transform: scale(1.05); }

        .action-bar {
            margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border-color);
            display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap;
        }
        .star-rating { display: flex; flex-direction: row-reverse; gap: 5px; cursor: pointer; }
        .star-rating input { display: none; }
        .star-rating label { font-size: 1.8rem; color: #444; transition: color 0.2s; }
        .star-rating input:checked ~ label,
        .star-rating label:hover,
        .star-rating label:hover ~ label { color: #ffc107; }
        
        .like-btn {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 10px 25px; border-radius: 50px; background: rgba(255,255,255,0.05);
            border: 1px solid var(--border-color); color: var(--muted-color); cursor: pointer; transition: all 0.3s;
        }
        .like-btn:hover { background: rgba(255,255,255,0.1); color: #ff4757; }
        .like-btn.liked { background: rgba(255, 71, 87, 0.1); color: #ff4757; border-color: rgba(255, 71, 87, 0.3); }
        
        .support-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8);
            display: grid; place-items: center; z-index: 3000; opacity: 0; visibility: hidden; transition: all 0.3s;
        }
        .support-modal-overlay.active { opacity: 1; visibility: visible; }
        .support-modal {
            padding: 30px; border-radius: 20px; text-align: center; max-width: 350px; width: 90%;
            transform: scale(0.8); transition: all 0.3s;
        }
        .support-modal-overlay.active .support-modal { transform: scale(1); }
        .support-modal h3 { margin-bottom: 15px; }
        .support-modal p { color: var(--muted-color); font-size: 0.9rem; margin-bottom: 20px; }
        .upi-box {
            background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px;
            font-family: monospace; font-size: 1.1rem; color: var(--accent-cyan);
            border: 1px solid var(--border-color); margin-bottom: 15px; user-select: all;
        }
        .qr-placeholder {
            width: 150px; height: 150px; background: white; margin: 0 auto 15px;
            display: grid; place-items: center; color: black; font-weight: bold; border-radius: 10px;
        }

        /* --- TAB 2: WRITER --- */
        .writer-form { display: flex; flex-direction: column; gap: 20px; max-width: 800px; margin: 0 auto; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-label { font-weight: 600; color: var(--text-color); font-size: 0.95rem; }
        .form-input, .form-textarea {
            padding: 12px; border-radius: 10px; background: var(--card-bg);
            border: 1px solid var(--border-color); color: var(--text-color);
            font-size: 1rem; outline: none; transition: border-color 0.3s;
            font-family: inherit;
        }
