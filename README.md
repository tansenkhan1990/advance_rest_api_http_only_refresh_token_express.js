sudo docker build -t my-app .
sudo docker run -d -p 3000:3000 --name my-container my-app
sudo docker stop my-container
