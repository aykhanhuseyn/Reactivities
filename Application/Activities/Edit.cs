using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
  public class Edit
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; }
      public string Title { get; set; }
      public string Description { get; set; }
      public string Category { get; set; }
      public DateTime? Date { get; set; }
      public string City { get; set; }
      public string Venue { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      private readonly ILogger _logger;
      public Handler(DataContext context, ILogger<Activity> logger)
      {
        _logger = logger;
        _context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        try
        {
          cancellationToken.ThrowIfCancellationRequested();
        }
        catch (System.Exception ex)
        {
          if (ex is TaskCanceledException)
          {
            _logger.LogInformation("Activity creating process cancelled.");
            throw;
          }
          _logger.LogInformation(ex.Message);
          throw;
        }
        var data = await _context.Activities.FindAsync(request.Id);
        if (data == null)
          throw new Exception("Activity not found.");

        data.Title = request.Title ?? data.Title;
        data.Description = request.Description ?? data.Description;
        data.Category = request.Category ?? data.Category;
        data.Date = request.Date ?? data.Date;
        data.City = request.City ?? data.City;
        data.Venue = request.Venue ?? data.Venue;

        if (await _context.SaveChangesAsync() > 0) return Unit.Value;

        _logger.LogInformation("Problem in saving changes.");
        throw new Exception("Problem in saving changes.");
      }
    }
  }
}